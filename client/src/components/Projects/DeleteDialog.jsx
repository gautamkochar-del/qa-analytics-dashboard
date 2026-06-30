import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, } from "@mui/material";

export default function DeleteDialog({
  open, project, onClose, onConfirm, }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Delete Project
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete{" "}
          <strong>{project?.name}</strong>?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
