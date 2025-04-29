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
  Alert,
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
  loiDocument: File | null; // File object
  mouDocument: File | null; // File object
  gisDetails: File | null; // File object
  source: string; // Add the source field
}

// Define the props interface
interface AddFormDialogProps {
  open: boolean;
  onClose: () => void;
  onFormSubmitSuccess?: (response: any) => void; // Callback for successful submission
  formData: FormData;
  onFormChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isEditMode: boolean;
}

export default function AddFormDialog({
  open,
  onClose,
  onFormSubmitSuccess,
  formData,
  onFormChange,
  isEditMode,
}: AddFormDialogProps) {
  // Handle file uploads
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fieldName = event.target.name;
      onFormChange({
        target: { name: fieldName, value: file },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  // Validate form fields before submission
  const validateForm = (): boolean => {
    const requiredFields = [
      "communityMember",
      "idNumber",
      "phoneNumber",
      "communityName",
      "landSize",
      "sublocation",
      "location",
      "fieldCoordinator",
      "witnessLocal",
      "signedLocal",
      "signedOrg",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof FormData]
    );
    if (missingFields.length > 0) {
      alert(
        `Please fill out the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return false;
    }
    if (!formData.dateSigned) {
      alert("Please select a valid date for 'Date Signed'.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate the form data
      if (!validateForm()) return;

      // Create FormData object
      const formDataToSend = new FormData();

      // Serialize non-file fields into a JSON string
      const jsonData = {
        communityMember: formData.communityMember,
        idNumber: formData.idNumber,
        phoneNumber: formData.phoneNumber,
        communityName: formData.communityName,
        landSize: formData.landSize,
        sublocation: formData.sublocation,
        location: formData.location,
        fieldCoordinator: formData.fieldCoordinator,
        witnessLocal: formData.witnessLocal,
        signedLocal: formData.signedLocal,
        signedOrg: formData.signedOrg,
        dateSigned: formData.dateSigned?.format("YYYY-MM-DD"),
        source: formData.source || "", // Default to empty string if not provided
      };
      formDataToSend.append("data", JSON.stringify(jsonData));

      // Append files
      if (formData.loiDocument)
        formDataToSend.append("loiDocument", formData.loiDocument);
      if (formData.mouDocument)
        formDataToSend.append("mouDocument", formData.mouDocument);
      if (formData.gisDetails)
        formDataToSend.append("gisDetails", formData.gisDetails);

      // Submit the payload to the backend
      const response = await submitAddFormDialog(formDataToSend);

      // Validate the response
      if (!response || !response.data) {
        throw new Error("Invalid response from server. No data received.");
      }

      // Invoke the success callback with the backend response
      if (onFormSubmitSuccess) {
        onFormSubmitSuccess(response); // Pass the response to the parent component
      }

      alert("Form submitted successfully!");
      onClose(); // Close the dialog after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="dialog-title">
        {isEditMode ? "Edit Record" : "Add New Record"}
      </DialogTitle>
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
                    onChange={onFormChange}
                    fullWidth
                    required
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="idNumber"
                    label="ID Number"
                    value={formData.idNumber}
                    onChange={onFormChange}
                    fullWidth
                    required
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={onFormChange}
                    fullWidth
                    required
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="communityName"
                    label="Community Name"
                    value={formData.communityName}
                    onChange={onFormChange}
                    fullWidth
                    required
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
                    onChange={onFormChange}
                    fullWidth
                    required
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="sublocation"
                    label="Sublocation"
                    value={formData.sublocation}
                    onChange={onFormChange}
                    fullWidth
                    required
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="location"
                    label="Location"
                    value={formData.location}
                    onChange={onFormChange}
                    fullWidth
                    required
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
                    onChange={onFormChange}
                    fullWidth
                    required
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="witnessLocal"
                    label="Local Witness"
                    value={formData.witnessLocal}
                    onChange={onFormChange}
                    fullWidth
                    required
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="signedLocal"
                    label="Signed (Local)"
                    value={formData.signedLocal}
                    onChange={onFormChange}
                    fullWidth
                    required
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="signedOrg"
                    label="Signed (Org)"
                    value={formData.signedOrg}
                    onChange={onFormChange}
                    fullWidth
                    required
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <DatePicker
                    label="Date Signed"
                    value={formData.dateSigned}
                    onChange={(newValue) =>
                      onFormChange({
                        target: { name: "dateSigned", value: newValue || null },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
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
        <Button
          onClick={handleSubmit}
          className="submit-button"
          variant="contained"
        >
          {isEditMode ? "Save Changes" : "Add Record"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
