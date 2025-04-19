import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { submitAddFormDialog } from "../services/apiService"; // Import the API service function
import "../index.css";

// Define the shape of the form data
interface FormData {
  id?: number | null;
  communityMember: string;
  idNumber: string;
  phoneNumber: string;
  communityName: string;
  landSize: string;
  sublocation: string;
  location: string;
  fieldCoordinator: string;
  witnessLocal: string;
  signedLocal: string;
  signedOrg: string;
  dateSigned: Dayjs | null; // Date as a Dayjs object or null
  loiDocument: string; // Base64 string
  mouDocument: string; // Base64 string
  gisDetails: string; // Base64 string
  source: string; // Add the source field
}

// Define the props interface
interface AddFormDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddFormDialog({ open, onClose }: AddFormDialogProps) {
  const [formData, setFormData] = React.useState<FormData>({
    communityMember: "",
    idNumber: "",
    phoneNumber: "",
    communityName: "",
    landSize: "",
    sublocation: "",
    location: "",
    fieldCoordinator: "",
    witnessLocal: "",
    signedLocal: "",
    signedOrg: "",
    dateSigned: null, // Initialize as null
    loiDocument: "",
    mouDocument: "",
    gisDetails: "",
    source: "Other", // Default source value
  });

  // Handle changes in text fields
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file uploads and convert to base64
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const fieldName = event.target.name;
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: base64String, // Store file as base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Format the payload to match the backend's expectations
      const payload: FormData = {
        ...formData,
        dateSigned: formData.dateSigned?.format("YYYY-MM-DD") || null, // Format date as YYYY-MM-DD or send null
        source: formData.source || "Other", // Default source to "Other"
      };

      console.log("Sending payload to backend:", payload); // Log the payload

      // Submit the payload to the backend
      await submitAddFormDialog(payload);

      alert("Form submitted successfully!");
      onClose(); // Close the dialog after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="dialog-title">Add New Record</DialogTitle>
      <DialogContent className="dialog-content">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box component="form" className="form-container">
            {/* Member Details Section */}
            <Box className="section-box">
              <Typography variant="h6" className="section-header">
                Member Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="communityMember"
                    label="Name"
                    value={formData.communityMember}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="idNumber"
                    label="ID Number"
                    value={formData.idNumber}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="communityName"
                    label="Community Name"
                    value={formData.communityName}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Land Details Section */}
            <Box className="section-box">
              <Typography variant="h6" className="section-header">
                Land Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="landSize"
                    label="Land Size (acres)"
                    value={formData.landSize}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="sublocation"
                    label="Sublocation"
                    value={formData.sublocation}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="location"
                    label="Location"
                    value={formData.location}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Authorized Signatories Section */}
            <Box className="section-box">
              <Typography variant="h6" className="section-header">
                Authorized Signatories
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="fieldCoordinator"
                    label="Field Coordinator"
                    value={formData.fieldCoordinator}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="witnessLocal"
                    label="Local Witness"
                    value={formData.witnessLocal}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="signedLocal"
                    label="Signed (Local)"
                    value={formData.signedLocal}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="signedOrg"
                    label="Signed (Org)"
                    value={formData.signedOrg}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <DatePicker
                    label="Date Signed"
                    value={formData.dateSigned}
                    onChange={(newValue) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        dateSigned: newValue || null, // Ensure newValue is a dayjs object or null
                      }))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        className="date-picker"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Documents and GIS Information Section */}
            <Box className="section-box">
              <Typography variant="h6" className="section-header">
                Documents and GIS Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    type="file"
                    name="loiDocument"
                    label="Upload LOI Document (.pdf)"
                    inputProps={{ accept: ".pdf" }}
                    onChange={handleFileChange}
                    fullWidth
                    className="file-upload"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    type="file"
                    name="mouDocument"
                    label="Upload MOU Document (.pdf)"
                    inputProps={{ accept: ".pdf" }}
                    onChange={handleFileChange}
                    fullWidth
                    className="file-upload"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    type="file"
                    name="gisDetails"
                    label="Upload GIS File (.gpx, .kml)"
                    inputProps={{ accept: ".gpx,.kml" }}
                    onChange={handleFileChange}
                    fullWidth
                    className="file-upload"
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button onClick={onClose} className="cancel-button">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="submit-button">
          Add Record
        </Button>
      </DialogActions>
    </Dialog>
  );
}
