// src/components/Sidebar.tsx
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  SxProps,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PeopleIcon from "@mui/icons-material/People";
import TaskIcon from "@mui/icons-material/Task";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import FeedbackIcon from "@mui/icons-material/Feedback";

// Define types for navigation items
interface NavItem {
  text: string;
  icon: JSX.Element;
}

const Sidebar: React.FC = () => {
  // Main navigation items
  const mainNavItems: NavItem[] = [
    { text: "Home", icon: <HomeIcon /> },
    { text: "Analytics", icon: <AnalyticsIcon /> },
    { text: "LandOwners", icon: <PeopleIcon /> },
    { text: "Tasks", icon: <TaskIcon /> },
  ];

  // Bottom section items
  const bottomNavItems: NavItem[] = [
    { text: "Settings", icon: <SettingsIcon /> },
    { text: "About", icon: <InfoIcon /> },
    { text: "Feedback", icon: <FeedbackIcon /> },
  ];

  // Styles for the drawer
  const drawerStyles: SxProps = {
    width: 240,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 240,
      boxSizing: "border-box",
      backgroundColor: "#1E1E1E", // Dark background
      color: "#fff", // Light text
      borderRight: "none", // Remove default border
    },
  };

  // Styles for sections (main and bottom)
  const sectionStyles: SxProps = {
    margin: "20px 16px",
    borderRadius: "8px",
    backgroundColor: "#2B2B2B", // Slightly lighter than the drawer background
    padding: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
  };

  // Styles for list item buttons
  const listItemButtonStyles: SxProps = {
    borderRadius: "8px", // Rounded corners
    transition: "background-color 0.3s ease", // Smooth hover effect
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)", // Subtle hover glow
    },
  };

  // Styles for list item icons
  const listItemIconStyles: SxProps = {
    color: "#fff", // White icons
    minWidth: "40px", // Adjust icon spacing
  };

  // Styles for list item text
  const listItemTextStyles: SxProps = {
    fontSize: "14px", // Smaller font size
    fontWeight: "bold", // Bold text
  };

  return (
    <Drawer variant="permanent" sx={drawerStyles}>
      {/* Main Navigation Section */}
      <Box sx={sectionStyles}>
        <List>
          {mainNavItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton sx={listItemButtonStyles}>
                <ListItemIcon sx={listItemIconStyles}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={listItemTextStyles} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom Section (Settings, About, Feedback) */}
      <Box sx={{ ...sectionStyles, marginTop: "auto" }}>
        <List>
          {bottomNavItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton sx={listItemButtonStyles}>
                <ListItemIcon sx={listItemIconStyles}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={listItemTextStyles} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;