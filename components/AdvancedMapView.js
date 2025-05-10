import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, InfoWindow } from '@react-google-maps/api';
import { X } from 'lucide-react';

// Function to determine marker color based on hours
const getMarkerColor = (hours) => {
  if (hours >= 16) return '#E83A3A'; // High (16+ hrs) - using the more subtle red
  if (hours >= 8) return '#3A6EE8';  // Medium (8-15 hrs) - using the blue accent
  return '#6AAFE8';                  // Low (1-7 hrs) - lighter blue
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
    }
  ]
};

const AdvancedMapView = ({ selectedSchool, setSelectedSchool }) => {
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [center, setCenter] = useState({ lat: 40.873, lng: -74.163 }); // Clifton, NJ centered
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapType, setMapType] = useState('roadmap');

  // Updated School data with all 11 schools in Clifton Public Schools
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
    },
    { 
      id: 10, 
      name: "Clifton Public School #17", 
      address: "361 Lexington Avenue", 
      visits: 1, 
      hours: 3.5,
      lat: 40.870912,
      lng: -74.159725,
      technicians: ["Rupert Chandool"]
    },
    { 
      id: 11, 
      name: "Clifton Early Learner Academy", 
      address: "290 Brighton Road", 
      visits: 2, 
      hours: 9,
      lat: 40.859542,
      lng: -74.166287,
      technicians: ["Rupert Chandool"]
    }
  ];

  // Load Google Maps script with the marker library
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDOumlpWCle5-E5gauUJAKjey9k0VYSdr4",
    version: "weekly",
    libraries: ["marker"] // This is required for AdvancedMarkerElement
  });

  // Center map to fit all schools
  const fitBounds = useCallback(() => {
    if (mapRef.current && mapRef.current.fitBounds) {
      const bounds = new window.google.maps.LatLngBounds();
      schoolData.forEach(school => {
        bounds.extend({ lat: school.lat, lng: school.lng });
      });
      
      mapRef.current.fitBounds(bounds, {
        top: 30, right: 30, bottom: 30, left: 30
      });
      
      // Set an appropriate zoom level
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

  // Create marker element with proper styling
  const createAdvancedMarker = useCallback((school) => {
    if (!mapRef.current || !window.google || !window.google.maps || !window.google.maps.marker) {
      console.error('Google Maps Advanced Marker API not available');
      return null;
    }

    try {
      // Create marker content
      const color = getMarkerColor(school.hours);
      
      // Calculate scale based on hours (bigger for more hours)
      const scale = 1.0 + (school.hours / 50); // Subtle scaling based on hours
      
      // Create the pin element
      const pinElement = document.createElement('div');
      pinElement.className = 'marker-pin';
      pinElement.innerHTML = `
        <div style="
          width: ${40 * scale}px;
          height: ${40 * scale}px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <svg viewBox="0 0 24 32" width="${40 * scale}" height="${40 * scale}" style="position: absolute; top: 0; left: 0;">
            <path d="M12 0C5.4 0 0 5.4 0 12C0 20.4 12 32 12 32C12 32 24 20.4 24 12C24 5.4 18.6 0 12 0Z" 
                  fill="${color}" />
          </svg>
          <div style="
            color: white;
            font-weight: bold;
            font-size: ${14 * scale}px;
            position: relative;
            top: -${3 * scale}px;
            text-align: center;
            z-index: 1;
          ">${school.id}</div>
        </div>
      `;

      // Create advanced marker with the pin element
      const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat: school.lat, lng: school.lng },
        content: pinElement,
        title: school.name,
        zIndex: school.id === selectedSchool ? 1000 : 100
      });

      // Add click event listener
      advancedMarker.addListener('click', () => {
        setSelectedSchool(school.id);
      });

      // Store reference to the marker
      markersRef.current[school.id] = advancedMarker;
      
      return advancedMarker;
    } catch (error) {
      console.error('Error creating advanced marker:', error);
      return null;
    }
  }, [selectedSchool, setSelectedSchool]);

  // Create all markers
  const createMarkers = useCallback(() => {
    if (!mapRef.current || !isLoaded) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      marker.map = null;
    });
    markersRef.current = {};
    
    // Create new markers
    schoolData.forEach(school => {
      createAdvancedMarker(school);
    });
  }, [isLoaded, createAdvancedMarker, schoolData]);

  // Handle map load event
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMapLoaded(true);
    console.log('Map loaded callback triggered');
    
    // Fit map to bounds after a short delay
    setTimeout(() => {
      fitBounds();
    }, 100);
    
    // Create markers after map is loaded
    setTimeout(() => {
      createMarkers();
    }, 300);
  }, [fitBounds, createMarkers]);

  // Update markers when selection changes
  useEffect(() => {
    if (!mapLoaded) return;
    
    // Update z-index for selected marker
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const zIndex = Number(id) === selectedSchool ? 1000 : 100;
      marker.zIndex = zIndex;
    });
  }, [selectedSchool, mapLoaded]);

  // Note about local development
  useEffect(() => {
    console.log("NOTE: Using Google Maps Advanced Markers API");
    console.log("Tracking prevention errors are normal on localhost due to browser privacy settings.");
    console.log("The map will display correctly when deployed to a proper domain.");
  }, []);

  // Handle rendering errors
  if (loadError) return <div className="p-4 text-red-500">Error loading Google Maps API. Please try again later.</div>;
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
          {/* Advanced markers are added programmatically */}
          
          {/* Custom Info Window */}
          {selectedSchool && (
            <InfoWindow
              position={{
                lat: schoolData.find(s => s.id === selectedSchool)?.lat,
                lng: schoolData.find(s => s.id === selectedSchool)?.lng
              }}
              onCloseClick={() => setSelectedSchool(null)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -30)
              }}
            >
              <div className="p-3 max-w-xs">
                <div className="mb-2">
                  <h4 className="font-bold text-black text-base">
                    {schoolData.find(s => s.id === selectedSchool)?.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {schoolData.find(s => s.id === selectedSchool)?.address}
                  </p>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">
                    Visits: <b>{schoolData.find(s => s.id === selectedSchool)?.visits}</b>
                  </span>
                  <span className="text-sm">
                    Hours: <b>{schoolData.find(s => s.id === selectedSchool)?.hours}</b>
                  </span>
                </div>
                <div className="text-xs text-gray-600">
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
        <p>This map displays service intensity across the eleven Clifton Public School locations that received HVAC maintenance visits from March-April 2025. The color of each marker represents the total service hours at that location, with red indicating high service hours.</p>
        <p className="mt-2"><b>Note:</b> Click on any school marker to view details and use the map controls to zoom and pan.</p>
      </div>
    </div>
  );
};

export default AdvancedMapView;