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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
// GIS Viewer Imports
import { GoogleMap, Polyline } from "@react-google-maps/api";
// TrackPoint Interface
interface TrackPoint {
  lat: number;
  lng: number;
}
// Member Interface
interface Member {
  memberName: string;
  memberPhoneNumber: string;
  memberIdNumber: string;
  titleNumber: string;
}
// RowData Interface
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
// Main Component with LoadScript wrapper
const Wrapper = () => (
  <LoadScript googleMapsApiKey="AIzaSyD3er79jHsbfyl_okJYlzlbxRi552w9-1c">
    <DataTable />
  </LoadScript>
);

export default function DataTable() {
  // GIS Viewer State
  const [isGisViewerOpen, setIsGisViewerOpen] = React.useState<boolean>(false);
  const [currentGpxPoints, setCurrentGpxPoints] = React.useState<TrackPoint[]>(
    []
  );
  const [gisError, setGisError] = React.useState<string | null>(null);

  // Existing State
  const [expandedRow, setExpandedRow] = React.useState<number | null>(null);
  const [rows, setRows] = React.useState<RowData[]>([]);
  const [filteredRows, setFilteredRows] = React.useState<RowData[]>([]);
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
  const [isRepresentativeFormOpen, setIsRepresentativeFormOpen] =
    React.useState<boolean>(false);
  const [filters, setFilters] = React.useState<Record<string, any>>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] =
    React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [isPdfViewerOpen, setIsPdfViewerOpen] = React.useState<boolean>(false);
  const [currentPdfUrl, setCurrentPdfUrl] = React.useState<string | null>(null);

  const API_BASE_URL = "http://localhost:8080/api/forms";

  // Fetch Initial Data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/all`);
        if (!response || !response.data || !Array.isArray(response.data.data)) {
          throw new Error("Invalid or missing data from server.");
        }
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
        setRows(processedData);
        setFilteredRows(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle Search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = rows.filter((row) =>
      Object.values(row).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(term)
      )
    );
    setFilteredRows(filtered);
  };

  // Columns for Filtering
  const columns = [
    { id: "communityMember", label: "Community Member" },
    { id: "idNumber", label: "ID Number" },
    { id: "phoneNumber", label: "Phone Number" },
    { id: "landSize", label: "Land Size" },
    { id: "communityName", label: "Community Name" },
    { id: "sublocation", label: "Sublocation" },
    { id: "location", label: "Location" },
    { id: "fieldCoordinator", label: "Field Coordinator" },
    { id: "gisDetails", label: "GIS Details" },
  ];

  // Apply Filters
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

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({});
    setFilteredRows(rows);
  };

  // Form Data
  const initialIndividualFormData: RowData = {
    id: null,
    communityMember: "",
    idNumber: "",
    phoneNumber: "",
    landSize: "",
    communityName: "",
    sublocation: "",
    location: "",
    fieldCoordinator: "",
    dateSigned: null,
    signedLocal: "",
    signedOrg: "",
    witnessLocal: "",
    loiDocument: "",
    mouDocument: "",
    source: "Other",
    members: [],
    gisDetails: "",
  };
  const initialRepresentativeFormData: RowData = {
    ...initialIndividualFormData,
    source: "RepresentativeForm",
    groupName: "",
  };
  const [formData, setFormData] = React.useState<RowData>(
    initialIndividualFormData
  );

  // Expand/Collapse Row
  const handleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Open Form
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

  // Close Form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsRepresentativeFormOpen(false);
    setFormData(
      isRepresentativeFormOpen
        ? initialRepresentativeFormData
        : initialIndividualFormData
    );
  };

  // Form Change Handler
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

  // Submit Form
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
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === submittedData.id ? processedNewRow : row
          )
        );
        setFilteredRows((prevFilteredRows) =>
          prevFilteredRows.map((row) =>
            row.id === submittedData.id ? processedNewRow : row
          )
        );
      } else {
        setRows((prevRows) => [...prevRows, processedNewRow]);
        setFilteredRows((prevFilteredRows) => [
          ...prevFilteredRows,
          processedNewRow,
        ]);
      }
      alert(
        submittedData.id
          ? "Record updated successfully!"
          : "Record added successfully!"
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  // Edit Record
  const handleEdit = async (id: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      if (!response || !response.data || !response.data.data) {
        throw new Error("Invalid or missing data from server.");
      }
      const rowToEdit = response.data.data;
      const source = rowToEdit.source?.trim() || "Other";
      if (source === "RepresentativeForm") {
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
          members: [],
        });
        setIsFormOpen(true);
        setIsRepresentativeFormOpen(false);
      }
    } catch (error) {
      console.error("Error fetching record for edit:", error);
    }
  };

  // Delete Record
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

  // PDF Viewer Handler
  const handleOpenPdfViewer = (url: string | null | undefined) => {
    if (!url) return;
    const fullPath = url.startsWith("http")
      ? url
      : `http://localhost:8080${url}`;
    setCurrentPdfUrl(fullPath);
    setIsPdfViewerOpen(true);
  };

  // GIS Viewer Handler
  const handleOpenGisViewer = async (gpxPath: string) => {
    try {
      setGisError(null);
      const fullPath = gpxPath.startsWith("http")
        ? gpxPath
        : `http://localhost:8080${gpxPath}`;
      const response = await axios.get(fullPath, { responseType: "text" });
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "application/xml");
      const trackPoints: TrackPoint[] = Array.from(
        xmlDoc.getElementsByTagName("trkpt")
      ).map((point) => ({
        lat: parseFloat(point.getAttribute("lat") || "0"),
        lng: parseFloat(point.getAttribute("lon") || "0"),
      }));
      if (trackPoints.length === 0) {
        throw new Error("No track points found in GPX file");
      }
      setCurrentGpxPoints(trackPoints);
      setIsGisViewerOpen(true);
    } catch (error) {
      console.error("GPX load error:", error);
      setGisError("Failed to load or parse GPX file");
      alert("Failed to load or parse GPX file");
    }
  };

  // Map Ref for Bounds Adjustment
  const mapRef = React.useRef<google.maps.Map | null>(null);

  // Map Options
  const mapOptions = {
    mapTypeId: "satellite",
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
  };

  return (
    <Box className="data-table">
      {/* Header Section */}
      <Box className="table-header">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
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
                                <Button
                                  onClick={() =>
                                    handleOpenGisViewer(row.gisDetails)
                                  }
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                >
                                  View GIS Map
                                </Button>
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
                                <Button
                                  onClick={() =>
                                    handleOpenPdfViewer(row.loiDocument)
                                  }
                                  color="primary"
                                >
                                  View LOI
                                </Button>
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
                                <Button
                                  onClick={() =>
                                    handleOpenPdfViewer(row.mouDocument)
                                  }
                                  color="primary"
                                >
                                  View MOU
                                </Button>
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

      {/* GIS Viewer Dialog */}
      <Dialog
        open={isGisViewerOpen}
        onClose={() => setIsGisViewerOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>GIS Map Viewer</DialogTitle>
        <DialogContent>
          {gisError ? (
            <Typography color="error">{gisError}</Typography>
          ) : currentGpxPoints.length === 0 ? (
            <Typography>Loading map data...</Typography>
          ) : (
            <Box style={{ height: "600px", width: "100%" }}>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={currentGpxPoints[0]}
                zoom={13}
                options={mapOptions}
                onLoad={(map) => {
                  mapRef.current = map;
                  const bounds = new google.maps.LatLngBounds();
                  currentGpxPoints.forEach((point) => bounds.extend(point));
                  map.fitBounds(bounds);
                  map.setZoom(map.getZoom() - 1);
                }}
              >
                {/* Only the Polyline is rendered, no Markers */}
                {currentGpxPoints.length > 1 && (
                  <Polyline
                    key={`polyline-${currentGpxPoints
                      .map((p) => `${p.lat},${p.lng}`)
                      .join("-")}`}
                    path={currentGpxPoints}
                    options={{
                      strokeColor: "#FF0000",
                      strokeOpacity: 1,
                      strokeWeight: 3,
                      geodesic: true,
                      editable: false,
                    }}
                  />
                )}
              </GoogleMap>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsGisViewerOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog
        open={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>View Document</DialogTitle>
        <DialogContent>
          {currentPdfUrl ? (
            <iframe
              src={currentPdfUrl}
              title="PDF Viewer"
              width="100%"
              height="600px"
              style={{ border: "none" }}
              onLoad={() => console.log("PDF loaded")}
            >
              This browser does not support PDFs. Please download the file to
              view it.
            </iframe>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPdfViewerOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
            if (formData.id) {
              setRows((prevRows) =>
                prevRows.map((row) =>
                  row.id === formData.id ? processedNewRow : row
                )
              );
              setFilteredRows((prevFilteredRows) =>
                prevFilteredRows.map((row) =>
                  row.id === formData.id ? processedNewRow : row
                )
              );
            } else {
              setRows((prevRows) => [...prevRows, processedNewRow]);
              setFilteredRows((prevFilteredRows) => [
                ...prevFilteredRows,
                processedNewRow,
              ]);
            }
            alert(
              formData.id
                ? "Record updated successfully!"
                : "Record added successfully!"
            );
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
            if (formData.id) {
              setRows((prevRows) =>
                prevRows.map((row) =>
                  row.id === formData.id ? processedNewRow : row
                )
              );
              setFilteredRows((prevFilteredRows) =>
                prevFilteredRows.map((row) =>
                  row.id === formData.id ? processedNewRow : row
                )
              );
            } else {
              setRows((prevRows) => [...prevRows, processedNewRow]);
              setFilteredRows((prevFilteredRows) => [
                ...prevFilteredRows,
                processedNewRow,
              ]);
            }
            alert(
              formData.id
                ? "Record updated successfully!"
                : "Record added successfully!"
            );
          }}
          isEditMode={!!formData.id}
        />
      )}
    </Box>
  );
}

// Export the wrapped version
export { Wrapper as DataTableWithMap };
