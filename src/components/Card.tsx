// src/components/Card.tsx
import React from "react";
import { Card, CardContent, Typography, Chip } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// Define the shape of the props using an interface
interface CardProps {
  title: string;
  value: string | number; // Value can be a string or number
  change: number; // Change should be a number (positive or negative)
  subtitle: string;
}

const CardComponent: React.FC<CardProps> = ({
  title,
  value,
  change,
  subtitle,
}) => {
  const icon = change > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;
  const chipColor = change > 0 ? "success" : "error";

  return (
    <Card
      sx={{
        bgcolor: "#3A3A3A",
        color: "#fff",
        p: 1.5, // Reduced padding for smaller size
        borderRadius: "10px", // Slightly smaller border radius
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
        transition: "transform 0.3s, box-shadow 0.3s", // Smooth hover transition
        "&:hover": {
          transform: "scale(1.03)", // Slightly less enlargement on hover
          boxShadow: "0 0 15px rgba(0, 123, 255, 0.5)", // Slightly reduced glow effect
        },
        "@media (max-width: 600px)": {
          width: "100%", // Responsive width for small screens
          p: 1, // Even smaller padding on mobile
        },
      }}
    >
      <CardContent>
        {/* Reduced font sizes for compactness */}
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", fontSize: "0.875rem" }}
        >
          {title}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, mb: 0.5, fontSize: "1.125rem" }}>
          {value}
        </Typography>
        {change !== null && (
          <Chip
            icon={icon}
            label={`${Math.abs(change)}%`}
            color={chipColor}
            size="small"
            sx={{ mt: 0.5 }} // Reduced margin for compactness
          />
        )}
        <Typography
          variant="caption"
          sx={{ mt: 0.5, display: "block", fontSize: "0.75rem" }}
        >
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardComponent;
