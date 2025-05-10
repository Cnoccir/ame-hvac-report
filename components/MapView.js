import React, { useState } from 'react';
import { X } from 'lucide-react';

// Function to determine marker color based on hours
const getMarkerColor = (hours) => {
  if (hours >= 16) return '#E83A3A'; // High (16+ hrs) - using the more subtle red
  if (hours >= 8) return '#3A6EE8';  // Medium (8-15 hrs) - using the blue accent
  return '#6AAFE8';                  // Low (1-7 hrs) - lighter blue
};

const MapView = ({ selectedSchool, setSelectedSchool }) => {
  // School data with accurate GPS coordinates (based on Google Maps link)
  const updatedSchoolData = [
    { 
      id: 1, 
      name: "Clifton High School", 
      address: "333 Colfax Avenue", 
      visits: 3, 
      hours: 21.5,
      // Coordinates from Google Maps
      lat: 40.868145,
      lng: -74.164007,
      technicians: ["Rupert Chandool", "Richard Bhajan"],
      color: getMarkerColor(21.5) // High hours
    },
    { 
      id: 2, 
      name: "Clifton Stadium Weight Room", 
      address: "350 Piaget Avenue", 
      visits: 2, 
      hours: 9,
      lat: 40.874987,
      lng: -74.162859,
      technicians: ["Rupert Chandool", "Threshan Ramsarran"],
      color: getMarkerColor(9) // Medium hours
    },
    { 
      id: 3, 
      name: "Clifton Public School #1", 
      address: "158 Park Slope", 
      visits: 2, 
      hours: 8,
      lat: 40.879012,
      lng: -74.168229,
      technicians: ["Rupert Chandool"],
      color: getMarkerColor(8) // Medium hours
    },
    { 
      id: 4, 
      name: "Clifton Public School #3", 
      address: "365 Washington Avenue", 
      visits: 2, 
      hours: 6,
      lat: 40.876543,
      lng: -74.164582,
      technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran"],
      color: getMarkerColor(6) // Low hours
    },
    { 
      id: 5, 
      name: "Clifton Public School #4", 
      address: "194 West 2nd Street", 
      visits: 2, 
      hours: 5,
      lat: 40.882364,
      lng: -74.163297,
      technicians: ["Rupert Chandool", "Henry Sanchez"],
      color: getMarkerColor(5) // Low hours
    },
    { 
      id: 6, 
      name: "Clifton Public School #5", 
      address: "136 Valley Road", 
      visits: 3, 
      hours: 9,
      lat: 40.888219,
      lng: -74.167086,
      technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran"],
      color: getMarkerColor(9) // Medium hours
    },
    { 
      id: 7, 
      name: "Clifton Public School #9", 
      address: "25 Brighton Road", 
      visits: 2, 
      hours: 8,
      lat: 40.857428,
      lng: -74.163247,
      technicians: ["Rupert Chandool"],
      color: getMarkerColor(8) // Medium hours
    },
    { 
      id: 8, 
      name: "Clifton Public School #11", 
      address: "147 Merselis Avenue", 
      visits: 3, 
      hours: 15.5,
      lat: 40.884769,
      lng: -74.153426,
      technicians: ["Rupert Chandool", "Threshan Ramsarran"],
      color: getMarkerColor(15.5) // Medium hours
    },
    { 
      id: 9, 
      name: "Clifton Public School #14", 
      address: "99 Saint Andrews Blvd", 
      visits: 3, 
      hours: 7,
      lat: 40.864582,
      lng: -74.165423,
      technicians: ["Rupert Chandool"],
      color: getMarkerColor(7) // Low hours
    }
  ];

  // Calculate map bounds from the coordinates
  const calculateBounds = () => {
    const minLat = Math.min(...updatedSchoolData.map(s => s.lat)) - 0.002;
    const maxLat = Math.max(...updatedSchoolData.map(s => s.lat)) + 0.002;
    const minLng = Math.min(...updatedSchoolData.map(s => s.lng)) - 0.002;
    const maxLng = Math.max(...updatedSchoolData.map(s => s.lng)) + 0.002;
    return { minLat, maxLat, minLng, maxLng };
  };

  // Get map bounds for proper positioning
  const bounds = calculateBounds();
  
  // Function to convert lat/lng to pixel positions based on the bounds
  const getPixelPosition = (lat, lng) => {
    const { minLat, maxLat, minLng, maxLng } = bounds;
    
    // Calculate percentage position within bounds
    const latPercent = 1 - ((lat - minLat) / (maxLat - minLat));
    const lngPercent = (lng - minLng) / (maxLng - minLng);
    
    // Return pixel positions as percentages
    return {
      top: `${latPercent * 100}%`,
      left: `${lngPercent * 100}%`
    };
  };

  return (
    <div className="relative">
      <h3 className="text-lg font-bold uppercase mb-1 text-black">GEOGRAPHIC SERVICE DISTRIBUTION</h3>
      <p className="text-sm text-gray-600 mb-4">March-April 2025 | Clifton Public Schools</p>

      <div className="relative h-64 md:h-96 border border-gray-300 rounded-lg overflow-hidden">
        {/* Using a static Google Maps image with correct bounds */}
        <img 
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${
            (bounds.minLat + bounds.maxLat) / 2
          },${
            (bounds.minLng + bounds.maxLng) / 2
          }&zoom=14&size=1200x600&maptype=roadmap&key=AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik`}
          alt="Clifton Schools Map"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to the original satellite image if Google Maps API fails
            e.target.src = "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/clifton-satellite-map.jpg";
          }}
        />
        
        {/* School location markers with accurate positioning */}
        {updatedSchoolData.map(school => {
          const position = getPixelPosition(school.lat, school.lng);
          return (
            <div 
              key={school.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              style={{
                top: position.top,
                left: position.left,
                zIndex: selectedSchool === school.id ? 50 : 10
              }}
              onClick={() => setSelectedSchool(school.id)}
            >
              {/* Circular marker with appropriate color */}
              <div 
                className="w-6 h-6 rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: school.color }}
              >
                <span className="text-xs font-bold text-white">{school.id}</span>
              </div>
            </div>
          );
        })}
        
        {/* School info popup - styled to match Image 1 */}
        {selectedSchool && (
          <div className="absolute bottom-4 left-2 right-2 md:left-4 md:right-4 bg-white p-2 md:p-3 rounded-lg shadow-lg z-50 border border-gray-300 max-w-full md:max-w-lg mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-black text-sm md:text-base">
                  {updatedSchoolData.find(s => s.id === selectedSchool)?.name}
                </h4>
                <p className="text-xs md:text-sm">
                  {updatedSchoolData.find(s => s.id === selectedSchool)?.address}
                </p>
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedSchool(null)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex justify-between mt-2 md:mt-3 text-xs md:text-sm">
              <span>Visits: <b>{updatedSchoolData.find(s => s.id === selectedSchool)?.visits}</b></span>
              <span>Hours: <b>{updatedSchoolData.find(s => s.id === selectedSchool)?.hours}</b></span>
            </div>
            <div className="mt-1 text-xs text-gray-600">
              Technicians: {updatedSchoolData.find(s => s.id === selectedSchool)?.technicians.join(", ")}
            </div>
          </div>
        )}
        
        {/* Map legend - styled to match Image 1 with updated colors */}
        <div className="absolute top-2 right-2 bg-white p-1 md:p-2 rounded shadow-md text-xs max-w-[120px] md:max-w-none">
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
        <p>This map displays service intensity across the nine Clifton Public School locations that received HVAC maintenance visits from March-April 2025. The color intensity of each marker represents the total service hours at that location, with red indicating high service hours.</p>
        <p className="mt-2"><b>Note:</b> Click on any school marker to view details about the service at that location.</p>
      </div>
    </div>
  );
};

export default MapView;