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
  Fab,
  Tooltip,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import AddIcon from "@mui/icons-material/Add";
import dayjs, { Dayjs } from "dayjs";
import { submitRepresentativeForm } from "../services/apiService";
import "../index.css";

// Define types for the form data and members
interface Member {
  memberIdNumber: string;
  memberName: string;
  memberPhoneNumber: string;
  titleNumber: string;
}

interface FormData {
  id?: string;
  groupName: string;
  representativeName: string;
  representativeIdNumber: string;
  representativePhone: string;
  communityName: string;
  landSize: string;
  sublocation: string;
  location: string;
  fieldCoordinator: string;
  witnessLocal: string;
  signedLocal: string;
  signedOrg: string;
  dateSigned: Dayjs | null;
  loiDocument: string | null; // Base64 string
  mouDocument: string | null; // Base64 string
  gisDetails: string | null; // Base64 string
  members: Member[];
  source: string; // Added source field
}

interface RepresentativeFormProps {
  open: boolean;
  onClose: () => void;
}

export default function RepresentativeForm({
  open,
  onClose,
}: RepresentativeFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    groupName: "",
    representativeName: "",
    representativeIdNumber: "",
    representativePhone: "",
    communityName: "",
    landSize: "",
    sublocation: "",
    location: "",
    fieldCoordinator: "",
    witnessLocal: "",
    signedLocal: "",
    signedOrg: "",
    dateSigned: null,
    loiDocument: null,
    mouDocument: null,
    gisDetails: null,
    members: [
      {
        memberIdNumber: "",
        memberName: "",
        memberPhoneNumber: "",
        titleNumber: "",
      },
    ],
    source: "RepresentativeForm", // Default source value
  });

  const [members, setMembers] = React.useState<Member[]>(formData.members);

  // Handle changes in form fields
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

  // Handle changes in group member fields
  const handleMemberChange = (
    index: number,
    field: keyof Member,
    value: string
  ) => {
    const updatedMembers = members.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    );
    setMembers(updatedMembers);
  };

  // Add a new group member field
  const addMemberField = () => {
    setMembers([
      ...members,
      {
        memberIdNumber: "",
        memberName: "",
        memberPhoneNumber: "",
        titleNumber: "",
      },
    ]);
  };

  // Remove a group member field
  const removeMemberField = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  // Validate group members
  const validateMembers = () => {
    const isValid = members.every(
      (member) => member.memberName && member.memberPhoneNumber
    );
    if (!isValid) {
      alert("Please fill out all required fields for group members.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateMembers()) return;

    try {
      const payload = {
        ...formData,
        dateSigned: formData.dateSigned?.format("YYYY-MM-DD"), // Format date for backend
        members,
      };

      console.log("Sending payload to backend:", payload); // Log the payload being sent
      await submitRepresentativeForm(payload);
      alert("Form submitted successfully!");
      onClose(); // Close the dialog after submission
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="dialog-title">Add New Representative</DialogTitle>
      <DialogContent className="dialog-content">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box component="form" className="form-container">
            {/* Community Group Details Section */}
            <Box className="section-box">
              <Typography variant="h6" className="section-header">
                Community Group Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="groupName"
                    label="Group Name"
                    value={formData.groupName}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="representativeName"
                    label="Representative Name"
                    value={formData.representativeName}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="representativeIdNumber"
                    label="Representative ID Number"
                    value={formData.representativeIdNumber}
                    onChange={handleFormChange}
                    fullWidth
                    className="text-field"
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="grid-item">
                  <TextField
                    name="representativePhone"
                    label="Representative Phone Number"
                    value={formData.representativePhone}
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

            {/* Group Members Section */}
            <Box className="section-box">
              <Typography variant="h6" className="section-header">
                Group Member Details
              </Typography>
              {members.map((member, index) => (
                <Box key={index} className="member-box">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} className="grid-item">
                      <TextField
                        name={`memberName-${index}`}
                        label="Member Name"
                        value={member.memberName}
                        onChange={(e) =>
                          handleMemberChange(
                            index,
                            "memberName",
                            e.target.value
                          )
                        }
                        fullWidth
                        className="text-field"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} className="grid-item">
                      <TextField
                        name={`memberPhoneNumber-${index}`}
                        label="Member Phone Number"
                        value={member.memberPhoneNumber}
                        onChange={(e) =>
                          handleMemberChange(
                            index,
                            "memberPhoneNumber",
                            e.target.value
                          )
                        }
                        fullWidth
                        className="text-field"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} className="grid-item">
                      <TextField
                        name={`memberIdNumber-${index}`}
                        label="Member ID Number"
                        value={member.memberIdNumber}
                        onChange={(e) =>
                          handleMemberChange(
                            index,
                            "memberIdNumber",
                            e.target.value
                          )
                        }
                        fullWidth
                        className="text-field"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} className="grid-item">
                      <TextField
                        name={`titleNumber-${index}`}
                        label="Title Number"
                        value={member.titleNumber}
                        onChange={(e) =>
                          handleMemberChange(
                            index,
                            "titleNumber",
                            e.target.value
                          )
                        }
                        fullWidth
                        className="text-field"
                      />
                    </Grid>
                  </Grid>
                  <Button
                    onClick={() => removeMemberField(index)}
                    className="remove-member-button"
                    disabled={members.length === 1}
                  >
                    Remove Member
                  </Button>
                </Box>
              ))}
              <Tooltip title="Add Member">
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={addMemberField}
                  className="add-member-fab"
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
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
                        dateSigned: newValue,
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
