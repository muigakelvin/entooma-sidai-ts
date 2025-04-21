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
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import AddFormDialog from "./AddFormDialog";
import RepresentativeForm from "./RepresentativeForm";
import FilterPanel from "./FilterPanel";
import "../index.css";

interface Member {
  memberName: string;
  memberPhoneNumber: string;
  memberIdNumber: string;
  titleNumber: string;
}

interface RowData {
  id?: number | null;
  communityMember: string;
  idNumber: string;
  phoneNumber: string;
  landSize: string;
  communityName: string;
  sublocation: string;
  location: string;
  fieldCoordinator: string;
  dateSigned: Dayjs | null;
  signedLocal: string;
  signedOrg: string;
  witnessLocal: string;
  loiDocument: string;
  mouDocument: string;
  source: "Other" | "RepresentativeForm";
  members: Member[];
  groupName?: string;
  gisDetails?: string;
}

export default function DataTable() {
  const [expandedRow, setExpandedRow] = React.useState<number | null>(null);
  const [rows, setRows] = React.useState<RowData[]>([]);
  const [filteredRows, setFilteredRows] = React.useState<RowData[]>([]);
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
  const [isRepresentativeFormOpen, setIsRepresentativeFormOpen] =
    React.useState<boolean>(false);
  const [filters, setFilters] = React.useState<Record<string, any>>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] =
    React.useState<boolean>(false);
  const API_BASE_URL = "http://localhost:8080/api/forms";

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/all`);
        // Ensure the response contains valid data
        if (!response || !response.data || !Array.isArray(response.data.data)) {
          throw new Error("Invalid or missing data from server.");
        }

        // Correctly access the nested `data` property
        const processedData = response.data.data.map((row: RowData) =>
          row.source === "RepresentativeForm"
            ? {
                ...row,
                communityMember: row.communityMember || row.representativeName,
                idNumber: row.idNumber || row.representativeIdNumber,
                phoneNumber: row.phoneNumber || row.representativePhone,
              }
            : row
        );

        // Update state with processed data
        setRows(processedData);
        setFilteredRows(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { id: "communityMember", label: "Community Member" },
    { id: "idNumber", label: "ID Number" },
    { id: "phoneNumber", label: "Phone Number" },
    { id: "landSize", label: "Land Size" },
    { id: "communityName", label: "Community Name" },
    { id: "sublocation", label: "Sublocation" },
    { id: "location", label: "Location" },
    { id: "fieldCoordinator", label: "Field Coordinator" },
    { id: "dateSigned", label: "Date Signed" },
    { id: "signedLocal", label: "Signed Local" },
    { id: "signedOrg", label: "Signed Org" },
    { id: "witnessLocal", label: "Witness Local" },
    { id: "loiDocument", label: "LOI Document" },
    { id: "mouDocument", label: "MOU Document" },
    { id: "gisDetails", label: "GIS Details" },
  ];

  const handleApplyFilters = (appliedFilters: Record<string, any>) => {
    setFilters(appliedFilters);
    const filtered = rows.filter((row) =>
      Object.entries(appliedFilters).every(([key, filter]) => {
        if (!filter.visible) return true;
        const value = String(row[key]).toLowerCase();
        return value.includes(String(filter.value).toLowerCase());
      })
    );
    setFilteredRows(filtered);
  };

  const handleResetFilters = () => {
    setFilters({});
    setFilteredRows(rows);
  };

  const initialIndividualFormData: RowData = {
    id: null,
    communityMember: "",
    idNumber: "",
    phoneNumber: "",
    landSize: "",
    communityName: "",
    sublocation: "",
    location: "",
    gisDetails: "",
    fieldCoordinator: "",
    dateSigned: null,
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
    groupName: "",
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
    if (name === "dateSigned") {
      const parsedDate = dayjs(value);
      setFormData({
        ...formData,
        [name]: parsedDate.isValid() ? parsedDate : null,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (submittedData: RowData) => {
    try {
      let response;
      if (submittedData.id) {
        response = await axios.put(
          `${API_BASE_URL}/${submittedData.id}`,
          submittedData
        );
      } else {
        response = await axios.post(
          submittedData.source === "RepresentativeForm"
            ? `${API_BASE_URL}/representative-form`
            : `${API_BASE_URL}/add-form-dialog`,
          submittedData
        );
      }
      if (!response || !response.data) {
        throw new Error("Invalid response from server.");
      }
      const newRow = response.data;
      const processedNewRow =
        newRow.source === "RepresentativeForm"
          ? {
              ...newRow,
              communityMember:
                newRow.communityMember || newRow.representativeName,
              idNumber: newRow.idNumber || newRow.representativeIdNumber,
              phoneNumber: newRow.phoneNumber || newRow.representativePhone,
            }
          : newRow;
      if (submittedData.id) {
        const updatedRows = rows.map((row) =>
          row.id === submittedData.id ? processedNewRow : row
        );
        setRows(updatedRows);
        setFilteredRows(updatedRows);
      } else {
        setRows((prevRows) => [...prevRows, processedNewRow]);
        setFilteredRows((prevFilteredRows) => [
          ...prevFilteredRows,
          processedNewRow,
        ]);
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handleEdit = async (id: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      if (!response || !response.data) {
        throw new Error("Invalid response from server.");
      }
      const rowToEdit = response.data;

      if (rowToEdit.source === "RepresentativeForm") {
        setFormData({
          id: rowToEdit.id,
          representativeName: rowToEdit.representativeName || "",
          representativeIdNumber: rowToEdit.representativeIdNumber || "",
          representativePhone: rowToEdit.representativePhone || "",
          landSize: rowToEdit.landSize
            ? rowToEdit.landSize.replace(" acres", "")
            : "",
          communityName: rowToEdit.communityName || "",
          groupName: rowToEdit.groupName || "",
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
          members: rowToEdit.members || [], // Ensure members are populated
        });
        setIsRepresentativeFormOpen(true);
        setIsFormOpen(false);
      } else {
        setFormData({
          id: rowToEdit.id,
          communityMember: rowToEdit.communityMember || "",
          idNumber: rowToEdit.idNumber || "",
          phoneNumber: rowToEdit.phoneNumber || "",
          landSize: rowToEdit.landSize
            ? rowToEdit.landSize.replace(" acres", "")
            : "",
          communityName: rowToEdit.communityName || "",
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
          members: [], // No members for "Other" source
        });
        setIsFormOpen(true);
        setIsRepresentativeFormOpen(false);
      }
    } catch (error) {
      console.error("Error fetching record for edit:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      const updatedRows = rows.filter((row) => row.id !== id);
      setRows(updatedRows);
      setFilteredRows(updatedRows);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
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
                  <TableCell colSpan={6} className="detail-panel">
                    <Collapse
                      in={expandedRow === row.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box className="card-container">
                        {/* Location Card */}
                        <Card variant="outlined" className="detail-card">
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
                        <Card variant="outlined" className="detail-card">
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
                        <Card variant="outlined" className="detail-card">
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
                          <Card variant="outlined" className="detail-card">
                            <CardContent>
                              <Typography
                                variant="h5"
                                align="center"
                                gutterBottom
                              >
                                {row.groupName}
                              </Typography>
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
          onFormSubmitSuccess={(response) => {
            if (!response || !response.data) {
              alert("Invalid response from server.");
              return;
            }
            const newRow = response.data;
            const processedNewRow =
              newRow.source === "RepresentativeForm"
                ? {
                    ...newRow,
                    communityMember:
                      newRow.communityMember || newRow.representativeName,
                    idNumber: newRow.idNumber || newRow.representativeIdNumber,
                    phoneNumber:
                      newRow.phoneNumber || newRow.representativePhone,
                  }
                : newRow;
            setRows((prevRows) => [...prevRows, processedNewRow]);
            setFilteredRows((prevFilteredRows) => [
              ...prevFilteredRows,
              processedNewRow,
            ]);
            alert("Record added successfully!");
          }}
          isEditMode={!!formData.id}
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
          onFormSubmitSuccess={(response) => {
            if (!response || !response.data) {
              alert("Invalid response from server.");
              return;
            }
            const newRow = response.data;
            const processedNewRow =
              newRow.source === "RepresentativeForm"
                ? {
                    ...newRow,
                    communityMember:
                      newRow.communityMember || newRow.representativeName,
                    idNumber: newRow.idNumber || newRow.representativeIdNumber,
                    phoneNumber:
                      newRow.phoneNumber || newRow.representativePhone,
                  }
                : newRow;
            setRows((prevRows) => [...prevRows, processedNewRow]);
            setFilteredRows((prevFilteredRows) => [
              ...prevFilteredRows,
              processedNewRow,
            ]);
            alert("Record added successfully!");
          }}
        />
      )}
    </Box>
  );
}
