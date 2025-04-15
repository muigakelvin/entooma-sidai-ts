// src/components/DataTable.tsx
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  Grid,
  Tooltip,
  TextField,
  Button,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs"; // Import dayjs for date handling
import AddFormDialog from "./AddFormDialog"; // Import the AddFormDialog component
import RepresentativeForm from "./RepresentativeForm"; // Import the RepresentativeForm component
import FilterPanel from "./FilterPanel"; // Import the FilterPanel component
import "../index.css";

// Define types for the row data
interface Member {
  memberName: string;
  memberPhoneNumber: string;
  memberIdNumber: string;
  titleNumber: string;
}
interface RowData {
  id: number;
  communityMember: string;
  idNumber: string;
  phoneNumber: string;
  landSize: string;
  communityName: string;
  sublocation: string;
  location: string;
  fieldCoordinator: string;
  dateSigned: Dayjs | null; // Change type to Dayjs | null
  signedLocal: string;
  signedOrg: string;
  witnessLocal: string;
  loiDocument: string;
  mouDocument: string;
  source: "Other" | "RepresentativeForm";
  members: Member[];
  groupName?: string; // Optional for Individual rows
  gisDetails?: string; // Optional
}

const initialRows: RowData[] = [
  {
    id: 2,
    communityMember: "Jane Roe",
    idNumber: "987654321",
    phoneNumber: "+0987654321",
    landSize: "30 acres",
    communityName: "Community B",
    sublocation: "Subloc B",
    location: "Loc B",
    fieldCoordinator: "John Doe",
    dateSigned: dayjs("2023-10-02"), // Convert to Day.js object
    signedLocal: "No",
    signedOrg: "Yes",
    witnessLocal: "Witness B",
    loiDocument: "Not Uploaded",
    mouDocument: "Uploaded",
    source: "Other", // Default source
    members: [
      {
        memberName: "Alice Smith",
        memberPhoneNumber: "+1234567890",
        memberIdNumber: "M12345",
        titleNumber: "T001",
      },
      {
        memberName: "Bob Johnson",
        memberPhoneNumber: "+0987654321",
        memberIdNumber: "M67890",
        titleNumber: "T002",
      },
    ],
  },
  {
    id: 1,
    communityMember: "John Doe",
    idNumber: "123456789",
    phoneNumber: "+1234567890",
    landSize: "50 acres",
    sublocation: "Subloc A",
    location: "Loc A",
    fieldCoordinator: "Jane Smith",
    dateSigned: dayjs("2023-10-01"), // Convert to Day.js object
    communityName: "Community A",
    signedLocal: "Yes",
    signedOrg: "No",
    witnessLocal: "Witness A",
    loiDocument: "Uploaded",
    gisDetails: "Available",
    mouDocument: "Not Uploaded",
    source: "Other", // Default source
    members: [],
  },
];

export default function DataTable() {
  const [expandedRow, setExpandedRow] = React.useState<number | null>(null);
  const [rows, setRows] = React.useState<RowData[]>(initialRows);
  const [filteredRows, setFilteredRows] =
    React.useState<RowData[]>(initialRows);
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
  const [isRepresentativeFormOpen, setIsRepresentativeFormOpen] =
    React.useState<boolean>(false); // State for Representative Form

  // State for managing filters
  const [filters, setFilters] = React.useState<Record<string, any>>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] =
    React.useState<boolean>(false);

  // Define ALL columns for the filter panel, including hidden ones
  const columns = [
    { id: "communityMember", label: "Community Member" },
    { id: "idNumber", label: "ID Number" },
    { id: "phoneNumber", label: "Phone Number" },
    { id: "landSize", label: "Land Size" },
    { id: "communityName", label: "Community Name" },
    { id: "sublocation", label: "Sublocation" }, // Hidden column
    { id: "location", label: "Location" }, // Hidden column
    { id: "fieldCoordinator", label: "Field Coordinator" }, // Hidden column
    { id: "dateSigned", label: "Date Signed" }, // Hidden column
    { id: "signedLocal", label: "Signed Local" }, // Hidden column
    { id: "signedOrg", label: "Signed Org" }, // Hidden column
    { id: "witnessLocal", label: "Witness Local" }, // Hidden column
    { id: "loiDocument", label: "LOI Document" }, // Hidden column
    { id: "mouDocument", label: "MOU Document" }, // Hidden column
    { id: "gisDetails", label: "GIS Details" }, // Hidden column
  ];

  // Function to apply filters
  const handleApplyFilters = (appliedFilters: Record<string, any>) => {
    setFilters(appliedFilters);

    // Filter rows based on applied filters
    const filtered = rows.filter((row) =>
      Object.entries(appliedFilters).every(([key, filter]) => {
        if (!filter.visible) return true; // If column is not visible, skip filtering
        const value = String(row[key]).toLowerCase();
        return value.includes(String(filter.value).toLowerCase());
      })
    );

    setFilteredRows(filtered);
  };

  // Function to reset filters
  const handleResetFilters = () => {
    setFilters({});
    setFilteredRows(rows); // Reset to original rows
  };

  // Initial states for Individual and Representative forms
  const initialIndividualFormData: RowData = {
    id: null as unknown as number,
    communityMember: "",
    idNumber: "",
    phoneNumber: "",
    landSize: "",
    communityName: "",
    sublocation: "",
    location: "",
    gisDetails: "",
    fieldCoordinator: "",
    dateSigned: null, // Initialize as null
    signedLocal: "",
    signedOrg: "",
    witnessLocal: "",
    loiDocument: "",
    mouDocument: "",
    source: "Other",
    members: [],
  };
  const initialRepresentativeFormData: RowData = {
    ...initialIndividualFormData,
    source: "RepresentativeForm",
    groupName: "", // Include groupName explicitly
  };
  const [formData, setFormData] = React.useState<RowData>(
    initialIndividualFormData
  );

  const handleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleOpenForm = (formType: "individual" | "representative") => {
    if (formType === "representative") {
      setIsRepresentativeFormOpen(true);
      setIsFormOpen(false);
      setFormData(initialRepresentativeFormData);
    } else {
      setIsFormOpen(true);
      setIsRepresentativeFormOpen(false);
      setFormData(initialIndividualFormData);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsRepresentativeFormOpen(false);
    setFormData(
      isRepresentativeFormOpen
        ? initialRepresentativeFormData
        : initialIndividualFormData
    );
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Handle dateSigned field specifically
    if (name === "dateSigned") {
      const parsedDate = dayjs(value); // Parse the input value as a Day.js object
      setFormData({
        ...formData,
        [name]: parsedDate.isValid() ? parsedDate : null, // Only set valid dates
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (submittedData: RowData) => {
    const newRow: RowData = {
      id: submittedData.id || Date.now(),
      communityMember:
        submittedData.representativeName || submittedData.communityMember,
      idNumber: submittedData.representativeIdNumber || submittedData.idNumber,
      phoneNumber:
        submittedData.representativePhone || submittedData.phoneNumber,
      landSize: `${submittedData.landSize || "N/A"} acres`,
      communityName: submittedData.communityName || "N/A",
      groupName: submittedData.groupName || "N/A", // Map groupName to the new column
      sublocation: submittedData.sublocation || "N/A",
      location: submittedData.location || "N/A",
      gisDetails: submittedData.gisDetails || "Not Available",
      fieldCoordinator: submittedData.fieldCoordinator || "N/A",
      dateSigned: submittedData.dateSigned?.format("YYYY-MM-DD") || null, // Format as string
      signedLocal: submittedData.signedLocal || "No",
      signedOrg: submittedData.signedOrg || "No",
      witnessLocal: submittedData.witnessLocal || "N/A",
      loiDocument: submittedData.loiDocument || "Not Uploaded",
      mouDocument: submittedData.mouDocument || "Not Uploaded",
      source: isRepresentativeFormOpen ? "RepresentativeForm" : "Other",
      members: submittedData.members || [],
    };
    if (submittedData.id) {
      const updatedRows = rows.map((row) =>
        row.id === submittedData.id ? newRow : row
      );
      setRows(updatedRows);
      setFilteredRows(updatedRows);
    } else {
      setRows([...rows, newRow]);
      setFilteredRows([...filteredRows, newRow]);
    }
    handleCloseForm();
  };

  const handleEdit = (id: number) => {
    const rowToEdit = rows.find((row) => row.id === id);
    if (!rowToEdit) return;
    if (rowToEdit.source === "RepresentativeForm") {
      setFormData({
        id: rowToEdit.id,
        representativeName: rowToEdit.communityMember || "",
        representativeIdNumber: rowToEdit.idNumber || "",
        representativePhone: rowToEdit.phoneNumber || "",
        landSize: rowToEdit.landSize.replace(" acres", "") || "",
        communityName: rowToEdit.communityName || "",
        groupName: rowToEdit.groupName || "", // Ensure groupName is included
        sublocation: rowToEdit.sublocation || "",
        location: rowToEdit.location || "",
        gisDetails: rowToEdit.gisDetails || "",
        fieldCoordinator: rowToEdit.fieldCoordinator || "",
        dateSigned: rowToEdit.dateSigned ? dayjs(rowToEdit.dateSigned) : null,
        signedLocal: rowToEdit.signedLocal || "",
        signedOrg: rowToEdit.signedOrg || "",
        witnessLocal: rowToEdit.witnessLocal || "",
        loiDocument: rowToEdit.loiDocument || "",
        mouDocument: rowToEdit.mouDocument || "",
        source: "RepresentativeForm",
        members: rowToEdit.members || [],
      });
      setIsRepresentativeFormOpen(true);
      setIsFormOpen(false);
    } else {
      setFormData({
        id: rowToEdit.id,
        communityMember: rowToEdit.communityMember || "",
        idNumber: rowToEdit.idNumber || "",
        phoneNumber: rowToEdit.phoneNumber || "",
        landSize: rowToEdit.landSize.replace(" acres", "") || "",
        communityName: rowToEdit.communityName || "",
        groupName: rowToEdit.groupName || "", // Ensure groupName is included
        sublocation: rowToEdit.sublocation || "",
        location: rowToEdit.location || "",
        gisDetails: rowToEdit.gisDetails || "",
        fieldCoordinator: rowToEdit.fieldCoordinator || "",
        dateSigned: rowToEdit.dateSigned ? dayjs(rowToEdit.dateSigned) : null,
        signedLocal: rowToEdit.signedLocal || "",
        signedOrg: rowToEdit.signedOrg || "",
        witnessLocal: rowToEdit.witnessLocal || "",
        loiDocument: rowToEdit.loiDocument || "",
        mouDocument: rowToEdit.mouDocument || "",
        source: "Other",
        members: rowToEdit.members || [],
      });
      setIsFormOpen(true);
      setIsRepresentativeFormOpen(false);
    }
  };

  const handleDelete = (id: number) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    setFilteredRows(updatedRows);
  };

  return (
    <Box className="data-table">
      {/* Header Section */}
      <Box className="table-header">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setIsFilterPanelOpen(true)}>
                  <FilterListIcon className="filter-icon" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          className="search-bar"
        />
        <Box className="action-buttons">
          <Button
            variant="contained"
            onClick={() => handleOpenForm("individual")}
            className="add-button"
            startIcon={<AddIcon />}
          >
            Individual
          </Button>
          <Button
            variant="contained"
            onClick={() => handleOpenForm("representative")}
            className="add-button"
            startIcon={<AddIcon />}
          >
            Representative
          </Button>
        </Box>
      </Box>

      {/* Table Content */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="main-column">Community Member</TableCell>
              <TableCell className="main-column">ID Number</TableCell>
              <TableCell className="main-column">Phone</TableCell>
              <TableCell className="main-column">Land Size</TableCell>
              <TableCell className="main-column">Community</TableCell>
              <TableCell className="action-column">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <React.Fragment key={row.id}>
                {/* Main Row */}
                <TableRow className="table-row">
                  <TableCell className="main-column">
                    {row.communityMember}
                  </TableCell>
                  <TableCell className="main-column">{row.idNumber}</TableCell>
                  <TableCell className="main-column">
                    {row.phoneNumber}
                  </TableCell>
                  <TableCell className="main-column">{row.landSize}</TableCell>
                  <TableCell className="main-column">
                    {row.communityName}
                  </TableCell>
                  <TableCell className="action-column">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleExpand(row.id)}
                        className="table-button"
                      >
                        {expandedRow === row.id ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(row.id)}
                        className="table-button"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(row.id)}
                        className="table-button"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                {/* Detail Row */}
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="detail-panel"
                    sx={{ padding: 0 }}
                  >
                    <Collapse
                      in={expandedRow === row.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box
                        className="card-container"
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Location Card */}
                        <Card
                          variant="outlined"
                          className={`detail-card ${
                            expandedRow === row.id ? "active-card" : ""
                          }`}
                          sx={{
                            flex: "1 1 calc(33% - 16px)",
                            minWidth: 300,
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" className="detail-header">
                              Location Details
                            </Typography>
                            <div className="detail-item">
                              <span className="detail-label">Sublocation:</span>
                              <span className="detail-value">
                                {row.sublocation}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Location:</span>
                              <span className="detail-value">
                                {row.location}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">GIS File:</span>
                              {row.gisDetails &&
                              row.gisDetails !== "Not Available" ? (
                                <a
                                  href={row.gisDetails}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View GIS File
                                </a>
                              ) : (
                                <span className="detail-value">
                                  Not Available
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                        {/* Documentation Card */}
                        <Card
                          variant="outlined"
                          className={`detail-card ${
                            expandedRow === row.id ? "active-card" : ""
                          }`}
                          sx={{
                            flex: "1 1 calc(33% - 16px)",
                            minWidth: 300,
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" className="detail-header">
                              Documentation
                            </Typography>
                            <div className="detail-item">
                              <span className="detail-label">Date Signed:</span>
                              <span className="detail-value">
                                {dayjs.isDayjs(row.dateSigned) &&
                                row.dateSigned.isValid()
                                  ? row.dateSigned.format("YYYY-MM-DD")
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">
                                LOI Document:
                              </span>
                              {row.loiDocument &&
                              row.loiDocument !== "Not Uploaded" ? (
                                <a
                                  href={row.loiDocument}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View LOI
                                </a>
                              ) : (
                                <span className="detail-value">
                                  Not Uploaded
                                </span>
                              )}
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">
                                MOU Document:
                              </span>
                              {row.mouDocument &&
                              row.mouDocument !== "Not Uploaded" ? (
                                <a
                                  href={row.mouDocument}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View MOU
                                </a>
                              ) : (
                                <span className="detail-value">
                                  Not Uploaded
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                        {/* Approved Signatories Card */}
                        <Card
                          variant="outlined"
                          className={`detail-card ${
                            expandedRow === row.id ? "active-card" : ""
                          }`}
                          sx={{
                            flex: "1 1 calc(33% - 16px)",
                            minWidth: 300,
                          }}
                        >
                          <CardContent>
                            <Typography variant="h6" className="detail-header">
                              Approved Signatories
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <div className="detail-item">
                                  <span className="detail-label">
                                    Signed Local:
                                  </span>
                                  <span className="detail-value">
                                    {row.signedLocal}
                                  </span>
                                </div>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <div className="detail-item">
                                  <span className="detail-label">
                                    Signed Org:
                                  </span>
                                  <span className="detail-value">
                                    {row.signedOrg}
                                  </span>
                                </div>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <div className="detail-item">
                                  <span className="detail-label">
                                    Witness Local:
                                  </span>
                                  <span className="detail-value">
                                    {row.witnessLocal}
                                  </span>
                                </div>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <div className="detail-item">
                                  <span className="detail-label">
                                    Field Coordinator:
                                  </span>
                                  <span className="detail-value">
                                    {row.fieldCoordinator}
                                  </span>
                                </div>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                        {/* Conditional Fourth Card for RepresentativeForm Source */}
                        {row.source === "RepresentativeForm" && (
                          <Card
                            variant="outlined"
                            className={`detail-card ${
                              expandedRow === row.id ? "active-card" : ""
                            }`}
                            sx={{
                              flex: "1 1 calc(33% - 16px)",
                              minWidth: 300,
                            }}
                          >
                            <CardContent>
                              {/* Group Name Section */}
                              <Typography
                                variant="h5"
                                align="center"
                                gutterBottom
                                sx={{
                                  fontWeight: "bold",
                                  color: "#4caf50",
                                  marginBottom: 2,
                                }}
                              >
                                {row.groupName} {/* Use groupName here */}
                              </Typography>
                              {/* Group Member Details Section */}
                              <Typography
                                variant="h6"
                                className="detail-header"
                              >
                                Group Member Details
                              </Typography>
                              <TableContainer component={Paper}>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Member Name</TableCell>
                                      <TableCell>Member Phone Number</TableCell>
                                      <TableCell>Member ID</TableCell>
                                      <TableCell>Title Number</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {row.members && row.members.length > 0 ? (
                                      row.members.map((member, index) => (
                                        <TableRow key={index}>
                                          <TableCell>
                                            {member.memberName}
                                          </TableCell>
                                          <TableCell>
                                            {member.memberPhoneNumber}
                                          </TableCell>
                                          <TableCell>
                                            {member.memberIdNumber}
                                          </TableCell>
                                          <TableCell>
                                            {member.titleNumber}
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={4} align="center">
                                          No members available
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </CardContent>
                          </Card>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Filter Panel */}
      <FilterPanel
        open={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        columns={columns}
        filters={filters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Add/Edit Form Dialog */}
      {isFormOpen && (
        <AddFormDialog
          open={isFormOpen}
          onClose={handleCloseForm}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          isEditMode={!!formData.id} // Pass a flag to indicate edit mode
        />
      )}
      {/* Representative Form Dialog */}
      {isRepresentativeFormOpen && (
        <RepresentativeForm
          open={isRepresentativeFormOpen}
          onClose={handleCloseForm}
          formData={formData}
          onFormChange={handleFormChange}
          onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            setFormData({
              ...formData,
              [e.target.name]: file ? URL.createObjectURL(file) : "",
            });
          }}
          onSubmit={handleSubmit}
        />
      )}
    </Box>
  );
}
