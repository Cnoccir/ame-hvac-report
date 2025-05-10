import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { X } from 'lucide-react';

// Function to determine marker color based on hours
const getMarkerColor = (hours) => {
  if (hours >= 16) return '#E83A3A'; // High (16+ hrs) - using the more subtle red
  if (hours >= 8) return '#3A6EE8';  // Medium (8-15 hrs) - using the blue accent
  return '#6AAFE8';                  // Low (1-7 hrs) - lighter blue
};

// Function to create custom marker icon
const createMarkerIcon = (color) => {
  return {
    path: "M22.5,10.5c0,7.7-11.2,21.7-11.2,21.7S0,18.2,0,10.5C0,4.7,5,0,11.2,0S22.5,4.7,22.5,10.5z",
    fillColor: color,
    fillOpacity: 1,
    scale: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 1,
    anchor: new window.google.maps.Point(11.25, 32),
    labelOrigin: new window.google.maps.Point(11.25, 10.5)
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
    position: 1, // TOP_LEFT
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

const CombinedMapView = ({ selectedSchool, setSelectedSchool }) => {
  const mapRef = useRef(null);
  const heatmapRef = useRef(null);
  const [center, setCenter] = useState({ lat: 40.873, lng: -74.163 }); // Clifton, NJ centered
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  const [heatmapCreated, setHeatmapCreated] = useState(false);
  const [mapType, setMapType] = useState('roadmap');
  const [infoWindowsVisible, setInfoWindowsVisible] = useState({});

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
      
      // First, add the main points for each school
      schoolData.forEach(school => {
        // Create weighted points based on hours
        const weight = school.hours / 1.2; // Increased weight for more intensity
        heatmapData.push({
          location: new window.google.maps.LatLng(school.lat, school.lng),
          weight: weight
        });
      });
      
      // Now add additional points to create more "spread" in the heatmap
      schoolData.forEach(school => {
        // Add more points for higher-hour schools
        const numPoints = Math.max(8, Math.ceil(school.hours / 2)); // More points for more spread
        const radius = 0.004; // About 400 meters for spread
        
        // Create a wider spread for higher service hours
        const spreadFactor = (school.hours >= 16) ? 2.0 : 
                            (school.hours >= 8) ? 1.5 : 1.0;
        
        for (let i = 0; i < numPoints; i++) {
          const angle = (2 * Math.PI * i) / numPoints;
          const distance = radius * spreadFactor * (0.5 + Math.random() * 0.8); // Random variation in distance
          
          const lat = school.lat + Math.sin(angle) * distance;
          const lng = school.lng + Math.cos(angle) * distance;
          
          heatmapData.push({
            location: new window.google.maps.LatLng(lat, lng),
            weight: school.hours / 3 // Slightly lower weight for surrounding points
          });
        }
      });

      // Create heatmap layer
      const heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: mapRef.current,
        radius: 45, // Increased radius
        opacity: 0.8, // More opacity
        dissipating: true,
        maxIntensity: 10 // Adjusted for better visibility
      });

      // Set gradient similar to your image
      heatmap.set("gradient", [
        'rgba(106, 175, 232, 0)',
        'rgba(106, 175, 232, 0.3)',
        'rgba(58, 110, 232, 0.5)',
        'rgba(58, 110, 232, 0.7)',
        'rgba(232, 58, 58, 0.8)',
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

  // Toggle map type (roadmap/satellite)
  const toggleMapType = useCallback(() => {
    if (mapRef.current) {
      const newType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
      mapRef.current.setMapTypeId(newType);
      setMapType(newType);
    }
  }, [mapType]);

  // Handle map load event
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMapLoaded(true);
    console.log('Map loaded callback triggered');
    
    // Set initial map type to match screenshots
    map.setMapTypeId('roadmap');
    
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

  // Handle marker click
  const handleMarkerClick = (schoolId) => {
    setSelectedSchool(schoolId);
  };

  // Handle rendering errors
  if (loadError) return <div className="p-4 text-red-500">Error loading Google Maps API: {loadError.message}</div>;
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
          mapTypeId={mapType}
        >
          {/* School location markers */}
          {schoolData.map(school => (
            <Marker
              key={school.id}
              position={{ lat: school.lat, lng: school.lng }}
              icon={createMarkerIcon(getMarkerColor(school.hours))}
              onClick={() => handleMarkerClick(school.id)}
              label={{
                text: String(school.id),
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              animation={isLoaded ? window.google.maps.Animation.DROP : null}
              zIndex={selectedSchool === school.id ? 1000 : 100}
            />
          ))}

          {/* Custom Info Window */}
          {selectedSchool && (
            <InfoWindow
              position={{
                lat: schoolData.find(s => s.id === selectedSchool)?.lat,
                lng: schoolData.find(s => s.id === selectedSchool)?.lng
              }}
              onCloseClick={() => setSelectedSchool(null)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -30),
                closeBoxURL: "",
                boxStyle: {
                  width: "320px"
                }
              }}
            >
              <div>
                <div className="p-3 border-b border-gray-200">
                  <h4 className="font-bold text-lg">
                    {schoolData.find(s => s.id === selectedSchool)?.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {schoolData.find(s => s.id === selectedSchool)?.address}
                  </p>
                </div>
                <div className="flex justify-between items-center px-3 py-2">
                  <span className="text-sm">
                    Visits: <b>{schoolData.find(s => s.id === selectedSchool)?.visits}</b>
                  </span>
                  <span className="text-sm">
                    Hours: <b>{schoolData.find(s => s.id === selectedSchool)?.hours}</b>
                  </span>
                </div>
                <div className="px-3 pb-3 text-xs text-gray-600">
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

export default CombinedMapView;