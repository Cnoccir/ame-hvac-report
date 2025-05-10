import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { X } from 'lucide-react';

// Function to determine marker color based on hours
const getMarkerColor = (hours) => {
  if (hours >= 16) return '#E83A3A'; // High (16+ hrs) - using the more subtle red
  if (hours >= 8) return '#3A6EE8';  // Medium (8-15 hrs) - using the blue accent
  return '#6AAFE8';                  // Low (1-7 hrs) - lighter blue
};

// Function to create marker icon with custom color
const createMarkerIcon = (color) => {
  return {
    path: "M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z",
    fillColor: color,
    fillOpacity: 0.9,
    strokeWeight: 1,
    strokeColor: '#FFFFFF',
    scale: 1.8,
    anchor: { x: 12, y: 22 }
  };
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px'
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  mapTypeControlOptions: {
    style: 2, // HORIZONTAL_BAR
    position: 3, // TOP_LEFT
    mapTypeIds: ['roadmap', 'satellite']
  },
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
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }]
    }
  ]
};

const HeatmapGoogleMap = ({ selectedSchool, setSelectedSchool }) => {
  const mapRef = useRef(null);
  const heatmapRef = useRef(null);
  const [center, setCenter] = useState({ lat: 40.873, lng: -74.163 }); // Clifton, NJ centered
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  const [heatmapCreated, setHeatmapCreated] = useState(false);

  // School data with accurate GPS coordinates
  const schoolData = [
    { 
      id: 1, 
      name: "Clifton High School", 
      address: "333 Colfax Avenue", 
      visits: 3, 
      hours: 21.5,
      lat: 40.868145,
      lng: -74.164007,
      technicians: ["Rupert Chandool", "Richard Bhajan"]
    },
    { 
      id: 2, 
      name: "Clifton Stadium Weight Room", 
      address: "350 Piaget Avenue", 
      visits: 2, 
      hours: 9,
      lat: 40.874987,
      lng: -74.162859,
      technicians: ["Rupert Chandool", "Threshan Ramsarran"]
    },
    { 
      id: 3, 
      name: "Clifton Public School #1", 
      address: "158 Park Slope", 
      visits: 2, 
      hours: 8,
      lat: 40.879012,
      lng: -74.168229,
      technicians: ["Rupert Chandool"]
    },
    { 
      id: 4, 
      name: "Clifton Public School #3", 
      address: "365 Washington Avenue", 
      visits: 2, 
      hours: 6,
      lat: 40.876543,
      lng: -74.164582,
      technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran"]
    },
    { 
      id: 5, 
      name: "Clifton Public School #4", 
      address: "194 West 2nd Street", 
      visits: 2, 
      hours: 5,
      lat: 40.882364,
      lng: -74.163297,
      technicians: ["Rupert Chandool", "Henry Sanchez"]
    },
    { 
      id: 6, 
      name: "Clifton Public School #5", 
      address: "136 Valley Road", 
      visits: 3, 
      hours: 9,
      lat: 40.888219,
      lng: -74.167086,
      technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran"]
    },
    { 
      id: 7, 
      name: "Clifton Public School #9", 
      address: "25 Brighton Road", 
      visits: 2, 
      hours: 8,
      lat: 40.857428,
      lng: -74.163247,
      technicians: ["Rupert Chandool"]
    },
    { 
      id: 8, 
      name: "Clifton Public School #11", 
      address: "147 Merselis Avenue", 
      visits: 3, 
      hours: 15.5,
      lat: 40.884769,
      lng: -74.153426,
      technicians: ["Rupert Chandool", "Threshan Ramsarran"]
    },
    { 
      id: 9, 
      name: "Clifton Public School #14", 
      address: "99 Saint Andrews Blvd", 
      visits: 3, 
      hours: 7,
      lat: 40.864582,
      lng: -74.165423,
      technicians: ["Rupert Chandool"]
    }
  ];

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDOumlpWCle5-E5gauUJAKjey9k0VYSdr4",
    libraries: ["visualization"], // Important: For heatmap support
    version: "weekly"
  });

  // Center map to fit all schools
  const fitBounds = useCallback(() => {
    if (mapRef.current && mapRef.current.fitBounds) {
      const bounds = new window.google.maps.LatLngBounds();
      schoolData.forEach(school => {
        bounds.extend({ lat: school.lat, lng: school.lng });
      });
      
      // Add some padding
      mapRef.current.fitBounds(bounds, {
        top: 30, right: 30, bottom: 30, left: 30
      });
      
      // Set an appropriate zoom level that's not too close or too far
      setTimeout(() => {
        const currentZoom = mapRef.current.getZoom();
        if (currentZoom > 14) {
          mapRef.current.setZoom(14);
        } else if (currentZoom < 12) {
          mapRef.current.setZoom(12);
        }
      }, 200);
    }
  }, [schoolData]);

  // Create heatmap after map is loaded
  const createHeatmap = useCallback(() => {
    if (!mapRef.current || !window.google || !window.google.maps || !window.google.maps.visualization) {
      console.log('Missing dependencies for heatmap creation');
      return;
    }

    try {
      // Create heatmap data
      const heatmapData = [];
      schoolData.forEach(school => {
        heatmapData.push({
          location: new window.google.maps.LatLng(school.lat, school.lng),
          weight: school.hours / 3
        });
      });

      // Create heatmap layer
      const heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: mapRef.current,
        radius: 30,
        opacity: 0.7,
        dissipating: true,
        maxIntensity: 5
      });

      // Set gradient
      heatmap.set("gradient", [
        'rgba(106, 175, 232, 0)',
        'rgba(106, 175, 232, 0.5)',
        'rgba(58, 110, 232, 0.7)',
        'rgba(232, 58, 58, 0.9)',
        'rgba(232, 58, 58, 1)'
      ]);

      // Store reference
      heatmapRef.current = heatmap;
      setHeatmapCreated(true);
      console.log('Heatmap created successfully');
    } catch (error) {
      console.error('Error creating heatmap:', error);
    }
  }, [schoolData]);

  // Handle map load event
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMapLoaded(true);
    console.log('Map loaded callback triggered');
    
    // Fit map to bounds after a short delay to ensure proper rendering
    setTimeout(() => {
      fitBounds();
    }, 100);

    // Create heatmap after another short delay to ensure visualization library is loaded
    setTimeout(() => {
      createHeatmap();
    }, 500);
  }, [fitBounds, createHeatmap]);

  // Ensure the map fits all markers when component mounts
  useEffect(() => {
    if (mapLoaded && !heatmapCreated) {
      createHeatmap();
    }
  }, [mapLoaded, heatmapCreated, createHeatmap]);

  // Debug logging
  useEffect(() => {
    console.log('Map loaded:', isLoaded);
    if (isLoaded) {
      console.log('Google object available:', Boolean(window.google));
      console.log('Maps API available:', Boolean(window.google?.maps));
      console.log('Visualization library loaded:', Boolean(window.google?.maps?.visualization));
      console.log('Heatmap created:', heatmapCreated);
    }
  }, [isLoaded, heatmapCreated]);

  // Handle rendering errors
  if (loadError) return <div className="p-4 text-red-500">Error loading Google Maps</div>;
  if (!isLoaded) return <div className="p-4">Loading map...</div>;

  return (
    <div className="relative">
      <h3 className="text-lg font-bold uppercase mb-1 text-black">GEOGRAPHIC SERVICE DISTRIBUTION</h3>
      <p className="text-sm text-gray-600 mb-4">March-April 2025 | Clifton Public Schools</p>

      <div className="relative h-64 md:h-96 lg:h-[500px] border border-gray-300 rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={mapZoom}
          options={options}
          onLoad={onMapLoad}
        >
          {/* School location markers */}
          {schoolData.map(school => (
            <Marker
              key={school.id}
              position={{ lat: school.lat, lng: school.lng }}
              icon={createMarkerIcon(getMarkerColor(school.hours))}
              onClick={() => setSelectedSchool(school.id)}
              label={{
                text: String(school.id),
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 'bold',
                className: 'marker-label'
              }}
              animation={isLoaded ? window.google.maps.Animation.DROP : null}
            />
          ))}

          {/* School info popup */}
          {selectedSchool && (
            <InfoWindow
              position={{
                lat: schoolData.find(s => s.id === selectedSchool)?.lat + 0.0015,
                lng: schoolData.find(s => s.id === selectedSchool)?.lng
              }}
              onCloseClick={() => setSelectedSchool(null)}
            >
              <div className="p-1 max-w-xs">
                <h4 className="font-bold text-black text-sm mb-1">
                  {schoolData.find(s => s.id === selectedSchool)?.name}
                </h4>
                <p className="text-xs mb-1">
                  {schoolData.find(s => s.id === selectedSchool)?.address}
                </p>
                <div className="flex justify-between mt-2 text-xs">
                  <span>Visits: <b>{schoolData.find(s => s.id === selectedSchool)?.visits}</b></span>
                  <span>Hours: <b>{schoolData.find(s => s.id === selectedSchool)?.hours}</b></span>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Technicians: {schoolData.find(s => s.id === selectedSchool)?.technicians.join(", ")}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Map legend */}
        <div className="absolute top-2 right-2 bg-white p-1 md:p-2 rounded shadow-md text-xs z-10">
          <div className="font-bold mb-1 text-xs">Service Hours</div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full mr-1" style={{backgroundColor: '#6AAFE8'}}></div>
            <span className="text-xs">Low (1-7 hrs)</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full mr-1" style={{backgroundColor: '#3A6EE8'}}></div>
            <span className="text-xs">Medium (8-15 hrs)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full mr-1" style={{backgroundColor: '#E83A3A'}}></div>
            <span className="text-xs">High (16+ hrs)</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs md:text-sm text-gray-700">
        <p>This map displays service intensity across the nine Clifton Public School locations that received HVAC maintenance visits from March-April 2025. Both markers and the heatmap overlay represent service intensity, with red indicating high service hours.</p>
        <p className="mt-2"><b>Note:</b> Click on any school marker to view details and use the map controls to zoom and pan.</p>
      </div>
    </div>
  );
};

export default HeatmapGoogleMap;