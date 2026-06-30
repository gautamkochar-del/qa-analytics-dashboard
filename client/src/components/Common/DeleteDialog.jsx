import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, } from "@mui/material";

export default function DeleteDialog({
  open, title = "Delete", message = "Are you sure you want to delete this item?", onClose, onConfirm, }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
