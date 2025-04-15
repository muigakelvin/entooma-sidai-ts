// src/components/LineChart.tsx
import React, { useState, useRef } from "react";
import { LoadScript, GoogleMap, Polyline } from "@react-google-maps/api";

// Define types for track points
interface TrackPoint {
  lat: number;
  lng: number;
}

// Define styles
const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const defaultCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };

const LineChart: React.FC = () => {
  // State definitions with type annotations
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(defaultCenter);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => parseGPX(e.target?.result as string);
      reader.readAsText(file);
    }
  };

  // Parse GPX file content
  const parseGPX = (text: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    const trackPointsData: TrackPoint[] = Array.from(
      xmlDoc.getElementsByTagName("trkpt")
    ).map((point) => ({
      lat: parseFloat(point.getAttribute("lat") || "0"),
      lng: parseFloat(point.getAttribute("lon") || "0"),
    }));

    setTrackPoints(trackPointsData);

    if (trackPointsData.length > 0) {
      setMapCenter(trackPointsData[0]);
      adjustMapBounds(trackPointsData);
    }
  };

  // Adjust map bounds to fit all track points
  const adjustMapBounds = (trackPointsData: TrackPoint[]) => {
    if (!mapRef.current) return;
    const bounds = new window.google.maps.LatLngBounds();
    trackPointsData.forEach((point) => bounds.extend(point));
    mapRef.current?.fitBounds(bounds);
    mapRef.current?.setZoom(mapRef.current.getZoom() - 1);
  };

  // Handle map load
  const onLoad = (mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
  };

  return (
    <div className="map-container">
      {/* File input for GPX upload */}
      <input
        type="file"
        accept=".gpx"
        onChange={handleFileUpload}
        className="file-input"
      />
      {/* Load Google Maps API */}
      <LoadScript googleMapsApiKey="AIzaSyD3er79jHsbfyl_okJYlzlbxRi552w9-1c">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={10}
          onLoad={onLoad}
          className="gMaps"
        >
          {/* Render polyline if track points exist */}
          {trackPoints.length > 1 && (
            <Polyline
              path={trackPoints}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 1,
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default LineChart;