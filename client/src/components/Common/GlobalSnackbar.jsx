import { Snackbar, Alert } from "@mui/material";
import { useAppSnackbar } from "../../context/SnackbarContext";

export default function GlobalSnackbar() {
  const { snackbar, closeSnackbar } = useAppSnackbar();

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={closeSnackbar}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: "100%", borderRadius: "8px" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}
