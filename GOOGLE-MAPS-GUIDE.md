# Google Maps Integration Guide

This document provides information about the Google Maps JavaScript API implementation in the AME HVAC Report application.

## Overview

The application uses the Google Maps JavaScript API to display an interactive map of school locations with the following features:

- Interactive map with zoom, pan, and fullscreen controls
- Custom markers with color-coding based on service hours
- Heatmap overlay showing service intensity
- Info windows displaying detailed information when clicking markers
- Responsive design for desktop and mobile devices

## API Key

The application uses the following Google Maps API key:

```
AIzaSyDOumlpWCle5-E5gauUJAKjey9k0VYSdr4
```

**Important:** This API key should be restricted to authorized domains in the Google Cloud Console to prevent unauthorized usage.

## Dependencies

The implementation uses the `@react-google-maps/api` package, which provides React components for Google Maps. This package is installed via npm:

```bash
npm install @react-google-maps/api
```

## Key Components

### GoogleMapView

The `GoogleMapView` component (`components/GoogleMapView.js`) is the main component that implements the Google Maps functionality:

- Loads the Google Maps API with visualization library (for heatmap)
- Creates custom markers for each school
- Implements a heatmap overlay
- Handles user interactions (clicking markers)
- Displays detailed information in info windows

## Color Coding

The map uses a consistent color coding system:

- Red (`#E83A3A`): High service hours (16+ hours)
- Blue (`#3A6EE8`): Medium service hours (8-15 hours)
- Light Blue (`#6AAFE8`): Low service hours (1-7 hours)

This color scheme is applied to both markers and the heatmap gradient.

## Customization Options

### Map Options

The map is configured with specific options in the `options` constant:

```javascript
const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "poi.school",
      stylers: [{ visibility: "on" }]
    },
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }]
    }
  ]
};
```

These options can be adjusted to show/hide specific controls or style the map differently.

### Marker Icons

Custom marker icons are created using SVG paths:

```javascript
const createMarkerIcon = (color) => {
  return {
    path: "M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z...",
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: '#FFFFFF',
    scale: 1.5,
    anchor: { x: 12, y: 17 }
  };
};
```

The icon can be customized by changing the SVG path, colors, scale, etc.

### Heatmap Configuration

The heatmap is configured with specific options:

```javascript
<HeatmapLayer
  data={heatmapData}
  options={{
    radius: 20,
    opacity: 0.6,
    gradient: [
      'rgba(106, 175, 232, 0)',
      'rgba(106, 175, 232, 1)',
      'rgba(58, 110, 232, 1)',
      'rgba(232, 58, 58, 1)'
    ]
  }}
/>
```

These options can be adjusted to change the appearance of the heatmap.

## Future Enhancements

Potential enhancements to the map implementation:

1. **Clustering**: Implement marker clustering for areas with many schools close together
2. **Route Visualization**: Add the ability to visualize service routes between schools
3. **Time-based Filtering**: Allow filtering the map by service date/time
4. **Custom Map Styles**: Implement custom map styling to better match the AME brand
5. **Advanced Filtering**: Add controls to filter schools by various criteria (visits, hours, issues)

## Troubleshooting

Common issues:

1. **Map Not Loading**: Check if the API key is valid and has the necessary permissions
2. **Heatmap Not Showing**: Ensure the "visualization" library is included in the `libraries` array
3. **Markers Not Appearing**: Verify that the school data includes valid latitude and longitude values
4. **Performance Issues**: Consider reducing the radius or opacity of the heatmap for better performance

For any other issues, refer to the [@react-google-maps/api documentation](https://react-google-maps-api-docs.netlify.app/) or the [Google Maps JavaScript API documentation](https://developers.google.com/maps/documentation/javascript/overview).
