// src/components/Header.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  SxProps,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Define types for props if needed (currently no props are used)
interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1E1E1E" }}>
      <Toolbar>
        {/* Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sitemap-web{" "}
          <span style={{ color: "#888" }}>Web app</span>
        </Typography>

        {/* Search Field */}
        <TextField
          label="Search..."
          size="small"
          sx={searchFieldStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Date Range Icon */}
        <IconButton>
          <DateRangeIcon />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Apr 17, 2023
          </Typography>
        </IconButton>

        {/* Account Circle Icon */}
        <IconButton>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

// Styles for the search field
const searchFieldStyles: SxProps = {
  mr: 2, // Margin right
};

export default Header;