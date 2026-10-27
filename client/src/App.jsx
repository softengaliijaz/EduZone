import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/Routes";
import { fetchCurrentUser } from "./features/auth/authSlice";
import ConfirmDialogProvider from "./components/common/ConfirmDialogProvider";
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const authCheckStarted = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !authCheckStarted.current) {
      authCheckStarted.current = true;
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <ConfirmDialogProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          },
        }}
      />
    </ConfirmDialogProvider>
  );
}

export default App;
