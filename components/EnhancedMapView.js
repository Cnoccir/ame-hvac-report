import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, InfoWindow, Marker } from '@react-google-maps/api';
import { X, FileText, AlertTriangle, Users, Clock, Navigation } from 'lucide-react';
import { SERVICE_REPORTS } from '../utils/linkConfig';
import { trackSchoolSelection, trackReportView } from '../utils/analytics';

// Common issue types found at schools
const commonIssues = {
  1: ["Freeze Stat Problems", "Fan Failures"], // High School
  2: ["Filter Maintenance"], // Stadium Weight Room
  3: ["RTU Communication Failures", "Daikin VRV/VRF Integration"], // PS #1
  4: ["Daikin VRV/VRF Integration"], // PS #3
  5: ["Freeze Stat Problems", "Manual System Overrides"], // PS #4
  6: ["Manual System Overrides"], // PS #5
  7: ["Daikin VRV/VRF Integration", "Manual System Overrides"], // PS #9
  8: ["Heating Valve Defects", "JACE System Management", "Manual System Overrides"], // PS #11
  9: ["Heating Valve Defects", "Daikin VRV/VRF Integration"], // PS #14
  10: ["RTU Communication Failures"], // PS #17
  11: ["Heating Valve Defects", "VAV Damper Flow Issues", "Fan Failures"] // ELA
};

// Recent visits data for each school (up to 2 most recent visits)
const recentVisits = {
  1: [
    { date: "04/25/2025", tech: "Rupert Chandool", jobNo: "210973-12947" },
    { date: "03/24/2025", tech: "Richard Bhajan", jobNo: "210966-12940" }
  ],
  2: [
    { date: "04/23/2025", tech: "Rupert Chandool", jobNo: "210967-12941" },
    { date: "03/04/2025", tech: "Rupert Chandool & Threshan Ramsarran", jobNo: "210956-12930" }
  ],
  3: [
    { date: "04/21/2025", tech: "Rupert Chandool", jobNo: "210978-12952" },
    { date: "03/06/2025", tech: "Rupert Chandool", jobNo: "210960-12934" }
  ],
  4: [
    { date: "04/30/2025", tech: "Rupert Chandool", jobNo: "210993-12967" },
    { date: "03/21/2025", tech: "Henry Sanchez & Threshan Ramsarran", jobNo: "210964-12938" }
  ],
  5: [
    { date: "04/11/2025", tech: "Rupert Chandool", jobNo: "210976-12950" },
    { date: "03/21/2025", tech: "Henry Sanchez", jobNo: "210958-12932" }
  ],
  6: [
    { date: "04/30/2025", tech: "Rupert Chandool", jobNo: "210996-12970" },
    { date: "04/23/2025", tech: "Rupert Chandool", jobNo: "210977-12951" }
  ],
  7: [
    { date: "04/21/2025", tech: "Rupert Chandool", jobNo: "210979-12953" },
    { date: "03/06/2025", tech: "Rupert Chandool", jobNo: "210961-12935" }
  ],
  8: [
    { date: "04/23/2025", tech: "Rupert Chandool", jobNo: "210968-12942" },
    { date: "04/10/2025", tech: "Rupert Chandool", jobNo: "210975-12949" }
  ],
  9: [
    { date: "04/30/2025", tech: "Rupert Chandool", jobNo: "210991-12965" },
    { date: "04/10/2025", tech: "Rupert Chandool", jobNo: "210969-12943" }
  ],
  10: [
    { date: "04/11/2025", tech: "Rupert Chandool", jobNo: "211664-13788" }
  ],
  11: [
    { date: "04/09/2025", tech: "Rupert Chandool", jobNo: "210972-12946" },
    { date: "03/24/2025", tech: "Rupert Chandool", jobNo: "210965-12939" }
  ]
};

// Function to determine marker color based on hours
const getMarkerColor = (hours) => {
  if (hours >= 16) return '#E83A3A'; // High (16+ hrs) - using the more subtle red
  if (hours >= 8) return '#3A6EE8';  // Medium (8-15 hrs) - using the blue accent
  return '#6AAFE8';                  // Low (1-7 hrs) - lighter blue
};

// Function to create custom marker icon
const createMarkerIcon = (color, scale = 1.8) => {
  return {
    path: "M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z",
    fillColor: color,
    fillOpacity: 0.9,
    strokeWeight: 1,
    strokeColor: '#FFFFFF',
    scale: scale,
    anchor: { x: 12, y: 22 },
    labelOrigin: { x: 12, y: 9 }
  };
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px'
};

// Enhanced map options
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
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }]
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#5c5c5c" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#c9e9f6" }]
    }
  ]
};

const EnhancedMapView = ({ selectedSchool, setSelectedSchool, handleViewSchoolDetails }) => {
  const mapRef = useRef(null);
  const [center, setCenter] = useState({ lat: 40.873, lng: -74.163 }); // Clifton, NJ centered
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapType, setMapType] = useState('roadmap');
  const [activeTab, setActiveInfoTab] = useState('overview');

  // Updated School data with accurate coordinates
  const schoolData = [
    { 
      id: 1, 
      name: "Clifton High School", 
      address: "333 Colfax Avenue, Clifton NJ 07013", 
      visits: 3, 
      hours: 21.5,
      lat: 40.868145,
      lng: -74.164007,
      technicians: ["Rupert Chandool", "Richard Bhajan"]
    },
    { 
      id: 2, 
      name: "Clifton Stadium Weight Room", 
      address: "350 Piaget Avenue, Clifton NJ 07011", 
      visits: 2, 
      hours: 9,
      lat: 40.874987,
      lng: -74.162859,
      technicians: ["Rupert Chandool", "Threshan Ramsarran"]
    },
    { 
      id: 3, 
      name: "Clifton Public School #1", 
      address: "158 Park Slope, Clifton NJ 07011", 
      visits: 2, 
      hours: 8,
      lat: 40.879012,
      lng: -74.168229,
      technicians: ["Rupert Chandool"]
    },
    { 
      id: 4, 
      name: "Clifton Public School #3", 
      address: "365 Washington Avenue, Clifton NJ 07011", 
      visits: 2, 
      hours: 6,
      lat: 40.876438,   // Updated coordinates for better accuracy
      lng: -74.164721,  // Updated coordinates for better accuracy
      technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran"]
    },
    { 
      id: 5, 
      name: "Clifton Public School #4", 
      address: "194 West 2nd Street, Clifton NJ 07011", 
      visits: 2, 
      hours: 5,
      lat: 40.882364,
      lng: -74.163297,
      technicians: ["Rupert Chandool", "Henry Sanchez"]
    },
    { 
      id: 6, 
      name: "Clifton Public School #5", 
      address: "136 Valley Road, Clifton NJ 07013", 
      visits: 3, 
      hours: 9,
      lat: 40.888219,
      lng: -74.167086,
      technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran"]
    },
    { 
      id: 7, 
      name: "Clifton Public School #9", 
      address: "25 Brighton Road, Clifton NJ 07012", 
      visits: 2, 
      hours: 8,
      lat: 40.857428,
      lng: -74.163247,
      technicians: ["Rupert Chandool"]
    },
    { 
      id: 8, 
      name: "Clifton Public School #11", 
      address: "147 Merselis Avenue, Clifton NJ 07011", 
      visits: 3, 
      hours: 15.5,
      lat: 40.884931,   // Updated coordinates for better accuracy
      lng: -74.153508,  // Updated coordinates for better accuracy
      technicians: ["Rupert Chandool", "Threshan Ramsarran"]
    },
    { 
      id: 9, 
      name: "Clifton Public School #14", 
      address: "99 Saint Andrews Blvd, Clifton NJ 07013", 
      visits: 3, 
      hours: 7,
      lat: 40.864582,
      lng: -74.165423,
      technicians: ["Rupert Chandool"]
    },
    { 
      id: 10, 
      name: "Clifton School #17", 
      address: "361 Lexington Avenue, Clifton NJ 07011", 
      visits: 1, 
      hours: 3.5,
      lat: 40.872104,   // Updated coordinates for better accuracy
      lng: -74.159216,  // Updated coordinates for better accuracy
      technicians: ["Rupert Chandool"]
    },
    { 
      id: 11, 
      name: "Clifton Early Learner Academy", 
      address: "290 Brighton Road, Clifton NJ 07012", 
      visits: 2, 
      hours: 9,
      lat: 40.855403,   // Updated coordinates for better accuracy
      lng: -74.167211,  // Updated coordinates for better accuracy
      technicians: ["Rupert Chandool"]
    }
  ];

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDOumlpWCle5-E5gauUJAKjey9k0VYSdr4",
    version: "weekly",
    language: "en",
    region: "US"
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

  // Handle map load event
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMapLoaded(true);
    console.log('Map loaded successfully');
    
    // Fit map to bounds after a short delay
    setTimeout(() => {
      fitBounds();
    }, 100);
  }, [fitBounds]);

  // Check if running on client-side before accessing window
  const isClient = typeof window !== 'undefined';

  // Handle marker click
  const handleMarkerClick = (schoolId) => {
    const school = schoolData.find(s => s.id === schoolId);
    setSelectedSchool(schoolId);
    // Reset active tab to overview when selecting a new school
    setActiveInfoTab('overview');
    
    // Track school selection in analytics
    if (school) {
      trackSchoolSelection(school.name, school.id);
    }
  };

  // Navigate to school details in visit logs
  const viewSchoolDetails = useCallback((schoolId) => {
    try {
      // Close the info window
      setSelectedSchool(null);
      
      // If parent component provides the handler, use it to navigate
      if (typeof handleViewSchoolDetails === 'function') {
        const school = schoolData.find(s => s.id === schoolId);
        if (school) {
          handleViewSchoolDetails(school.name);
        }
      }
    } catch (err) {
      console.error("Error viewing school details:", err);
    }
  }, [handleViewSchoolDetails, schoolData, setSelectedSchool]);

  // Open service report in new window
  const openServiceReport = useCallback((jobNo) => {
    if (SERVICE_REPORTS[jobNo]) {
      try {
        // Track report view
        const schoolId = selectedSchool;
        const school = schoolData.find(s => s.id === schoolId);
        if (school) {
          trackReportView(jobNo, school.name);
        }
        
        // Open the report
        window.open(SERVICE_REPORTS[jobNo], '_blank');
      } catch (err) {
        console.error("Error opening service report:", err);
      }
    } else {
      console.warn(`Service report for job #${jobNo} not found.`);
    }
  }, [selectedSchool, schoolData]);

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
          {/* School location markers using standard markers with custom icons */}
          {schoolData.map(school => {
            // Calculate marker scale based on hours (slightly larger for more hours)
            const markerScale = 1.4 + (school.hours / 40);
            
            return (
              <Marker
                key={school.id}
                position={{ lat: school.lat, lng: school.lng }}
                icon={createMarkerIcon(getMarkerColor(school.hours), markerScale)}
                onClick={() => handleMarkerClick(school.id)}
                label={{
                  text: String(school.id),
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                animation={isClient && isLoaded ? window.google.maps.Animation.DROP : null}
                zIndex={selectedSchool === school.id ? 1000 : 100}
              />
            );
          })}

          {/* Enhanced Info Window with Tabs */}
          {selectedSchool && (
            <InfoWindow
              position={{
                lat: schoolData.find(s => s.id === selectedSchool)?.lat || 0,
                lng: schoolData.find(s => s.id === selectedSchool)?.lng || 0
              }}
              onCloseClick={() => setSelectedSchool(null)}
              options={{
                maxWidth: 320
              }}
            >
              <div className="max-w-xs">
                {/* Info Window Header */}
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                  <h4 className="font-bold text-black text-base">
                    {schoolData.find(s => s.id === selectedSchool)?.name}
                    {schoolData.find(s => s.id === selectedSchool)?.id === 10 && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">New</span>
                    )}
                  </h4>
                  <button 
                    onClick={() => setSelectedSchool(null)}
                    className="text-gray-500 hover:text-gray-800"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* School Address */}
                <div className="text-sm text-gray-600 mb-3 flex items-start">
                  <Navigation size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                  <span>{schoolData.find(s => s.id === selectedSchool)?.address}</span>
                </div>
                
                {/* Info Tabs */}
                <div className="flex border-b mb-3">
                  <button
                    className={`px-3 py-1 text-sm ${activeTab === 'overview' 
                      ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveInfoTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`px-3 py-1 text-sm ${activeTab === 'issues' 
                      ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveInfoTab('issues')}
                  >
                    Issues
                  </button>
                  <button
                    className={`px-3 py-1 text-sm ${activeTab === 'visits' 
                      ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveInfoTab('visits')}
                  >
                    Recent Visits
                  </button>
                </div>
                
                {/* Tab Content */}
                <div className="mb-3">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="text-sm flex items-center">
                          <Clock size={14} className="mr-1 text-gray-500" />
                          <span>Visits: <b>{schoolData.find(s => s.id === selectedSchool)?.visits}</b></span>
                        </div>
                        <div className="text-sm">
                          <span>Hours: <b>{schoolData.find(s => s.id === selectedSchool)?.hours}</b></span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-3 flex items-center">
                        <Users size={14} className="mr-1 text-gray-500" />
                        <span>Technicians: {schoolData.find(s => s.id === selectedSchool)?.technicians.join(", ")}</span>
                      </div>
                      
                      {/* Service Intensity Indicator */}
                      <div className="mb-2">
                        <div className="text-xs font-medium text-gray-700 mb-1">Service Intensity:</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{
                              width: `${Math.min(100, (schoolData.find(s => s.id === selectedSchool)?.hours / 25) * 100)}%`,
                              backgroundColor: getMarkerColor(schoolData.find(s => s.id === selectedSchool)?.hours)
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Issues Tab */}
                  {activeTab === 'issues' && (
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-2">Major Issues Identified:</div>
                      <ul className="text-sm space-y-1">
                        {commonIssues[selectedSchool]?.map((issue, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle size={14} className="mr-1 mt-0.5 text-amber-500 flex-shrink-0" />
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Visits Tab */}
                  {activeTab === 'visits' && (
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-2">Recent Service Visits:</div>
                      {recentVisits[selectedSchool]?.map((visit, index) => (
                        <div key={index} className="mb-2 text-sm border-b pb-2 last:border-b-0">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{visit.date}</span>
                            <a
                              href={SERVICE_REPORTS[visit.jobNo] || "#"}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center"
                              onClick={(e) => {
                                e.preventDefault();
                                openServiceReport(visit.jobNo);
                                return false;
                              }}
                            >
                              <FileText size={10} className="mr-1" />
                              Report
                            </a>
                          </div>
                          <div className="text-xs text-gray-600">Tech: {visit.tech}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* View Details Button */}
                <button
                  onClick={() => viewSchoolDetails(selectedSchool)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center justify-center transition-colors"
                >
                  <FileText size={14} className="mr-1" /> 
                  View Full Service History
                </button>
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

export default EnhancedMapView;