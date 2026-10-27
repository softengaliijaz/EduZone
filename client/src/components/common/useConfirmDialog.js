import { useContext } from "react";
import ConfirmDialogContext from "./confirmDialogContext";

const useConfirmDialog = () => {
  const confirm = useContext(ConfirmDialogContext);
  if (!confirm) {
    throw new Error("useConfirmDialog must be used within ConfirmDialogProvider.");
  }
  return confirm;
};

export default useConfirmDialog;
