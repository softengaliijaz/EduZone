import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AlertTriangle, LogOut } from "lucide-react";
import ConfirmDialogContext from "./confirmDialogContext";

export const ConfirmDialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);
  const resolver = useRef(null);
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  const restoreFocus = useRef(null);

  const finish = useCallback((confirmed) => {
    const resolve = resolver.current;
    resolver.current = null;
    setDialog(null);
    resolve?.(confirmed);
  }, []);

  const confirm = useCallback((options = {}) => {
    if (resolver.current) resolver.current(false);
    restoreFocus.current = document.activeElement;
    setDialog({
      title: options.title || "Are you sure?",
      message: options.message || "This action cannot be undone.",
      confirmLabel: options.confirmLabel || "Confirm",
      cancelLabel: options.cancelLabel || "Cancel",
      tone: options.tone === "neutral" ? "neutral" : "danger",
    });
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  useEffect(() => {
    if (dialog) {
      confirmRef.current?.focus();
      return;
    }
    restoreFocus.current?.focus?.();
    restoreFocus.current = null;
  }, [dialog]);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      finish(false);
    }
    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === cancelRef.current) {
        event.preventDefault();
        confirmRef.current?.focus();
      } else if (!event.shiftKey && document.activeElement === confirmRef.current) {
        event.preventDefault();
        cancelRef.current?.focus();
      }
    }
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div
          className="confirm-dialog__backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) finish(false);
          }}
        >
          <section
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            className="confirm-dialog"
            onKeyDown={handleKeyDown}
            role="alertdialog"
          >
            <div className={`confirm-dialog__icon confirm-dialog__icon--${dialog.tone}`} aria-hidden="true">
              {dialog.tone === "neutral" ? <LogOut size={22} /> : <AlertTriangle size={22} />}
            </div>
            <h2 id="confirm-dialog-title" className="confirm-dialog__title">{dialog.title}</h2>
            <p id="confirm-dialog-message" className="confirm-dialog__message">{dialog.message}</p>
            <div className="confirm-dialog__actions">
              <button ref={cancelRef} type="button" className="confirm-dialog__cancel" onClick={() => finish(false)}>
                {dialog.cancelLabel}
              </button>
              <button ref={confirmRef} type="button" className={`confirm-dialog__confirm confirm-dialog__confirm--${dialog.tone}`} onClick={() => finish(true)}>
                {dialog.confirmLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
};

export default ConfirmDialogProvider;
