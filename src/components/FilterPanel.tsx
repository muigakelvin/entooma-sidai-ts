// src/components/FilterPanel.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon

interface Column {
  id: string;
  label: string;
}

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  columns: Column[];
  filters: Record<string, any>;
  onApply: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export default function FilterPanel({
  open,
  onClose,
  columns,
  filters,
  onApply,
  onReset,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] =
    React.useState<Record<string, any>>(filters);

  const handleCheckboxChange = (id: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        visible: !prev[id]?.visible,
      },
    }));
  };

  const handleInputChange = (id: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        value: value,
      },
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    // Clear all filters
    const clearedFilters = columns.reduce((acc, column) => {
      acc[column.id] = { visible: false, value: "" };
      return acc;
    }, {} as Record<string, any>);
    setLocalFilters(clearedFilters); // Reset local state
    onReset(); // Call the parent reset function
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md" // Set a maximum width for the dialog
      fullWidth // Make the dialog take up the full width within the maxWidth
      PaperProps={{
        style: {
          backgroundColor: "#1e1e1e", // Dark background color
          borderRadius: "8px", // Rounded corners
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)", // Subtle shadow
        },
      }}
    >
      {/* Title with Close Button */}
      <DialogTitle
        sx={{
          fontSize: "1.5rem", // Larger font size
          fontWeight: "bold", // Bold title
          color: "#e0e0e0", // Light text color
          borderBottom: "1px solid #444", // Divider below the title
          padding: "16px 24px", // Adjust padding
          backgroundColor: "#2b2b2b", // Darker header background
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Filter Columns</span>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#bbb", // Light icon color
            "&:hover": {
              color: "#e0e0e0", // Slightly brighter on hover
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "24px", // Add padding
          backgroundColor: "#1e1e1e", // Match the dialog background
        }}
      >
        <Grid container spacing={2}>
          {columns.map((column) => (
            <Grid item xs={12} key={column.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!localFilters[column.id]?.visible}
                    onChange={() => handleCheckboxChange(column.id)}
                    sx={{
                      color: "#666", // Unchecked color
                      "&.Mui-checked": {
                        color: "#4caf50", // Checked color
                      },
                    }}
                  />
                }
                label={
                  <span
                    style={{
                      fontSize: "1rem", // Adjust font size
                      color: "#e0e0e0", // Light text color
                    }}
                  >
                    {column.label}
                  </span>
                }
              />
              {!!localFilters[column.id]?.visible && (
                <TextField
                  fullWidth
                  size="small"
                  placeholder={`Filter by ${column.label}`}
                  value={localFilters[column.id]?.value || ""}
                  onChange={(e) => handleInputChange(column.id, e.target.value)}
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px", // Rounded corners
                      backgroundColor: "#3a3a3a", // Dark input background
                      border: "1px solid #555", // Border
                      "&:hover fieldset": {
                        borderColor: "#4caf50", // Hover border color
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4caf50", // Focus border color
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      color: "#e0e0e0", // Light text color
                    },
                    "& .MuiInputLabel-root": {
                      color: "#bbb", // Light label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#4caf50", // Focused label color
                    },
                  }}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between", // Space out buttons
          padding: "16px 24px", // Adjust padding
          borderTop: "1px solid #444", // Divider above the actions
          backgroundColor: "#2b2b2b", // Darker footer background
        }}
      >
        <Button
          onClick={handleReset}
          color="error"
          variant="contained"
          sx={{
            backgroundColor: "#f44336", // Red background
            color: "#fff", // White text
            "&:hover": {
              backgroundColor: "#d32f2f", // Darker red on hover
            },
          }}
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          sx={{
            backgroundColor: "#4caf50", // Green background
            color: "#fff", // White text
            "&:hover": {
              backgroundColor: "#388e3c", // Darker green on hover
            },
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
