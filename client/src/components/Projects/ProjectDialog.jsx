import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress, } from "@mui/material";

export default function ProjectDialog({
  open, onClose, onSave, project, }) {
  const [form, setForm] = useState({
    name: "", description: "", });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || "", description: project.description || "", });
    } else {
      setForm({
        name: "", description: "", });
    }

    // Reset validation and loading whenever dialog opens
    setErrors({});
    setSaving(false);
  }, [project, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev, [name]: value, }));

    // Clear error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev, [name]: "", }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (form.name.length > 100) {
      newErrors.name = "Maximum 100 characters allowed";
    }

    if (form.description.length > 500) {
      newErrors.description =
        "Maximum 500 characters allowed";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      await onSave(form);

      setSaving(false);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {project ? "Edit Project" : "New Project"}
      </DialogTitle>

      <DialogContent>
        <TextField
          margin="normal"
          fullWidth
          required
          autoFocus
          label="Project Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          margin="normal"
          fullWidth
          multiline
          rows={4}
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={
            errors.description ||
            `${form.description.length}/500`
          }
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <CircularProgress
                size={18}
                color="inherit"
                sx={{ mr: 1 }}
              />
              Saving...
            </>
          ) : project ? (
            "Update Project"
          ) : (
            "Create Project"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
