import React, { useState } from 'react';
import { X } from 'lucide-react';

// Function to determine marker color based on hours
const getMarkerColor = (hours) => {
  if (hours >= 16) return '#FF3333'; // High (16+ hrs)
  if (hours >= 8) return '#3399FF';  // Medium (8-15 hrs)
  return '#66CCFF';                  // Low (1-7 hrs)
};

const MapView = ({ selectedSchool, setSelectedSchool }) => {
  // School data with accurate GPS coordinates (based on Image 3)
  const updatedSchoolData = [
    { 
      id: 1, 
      name: "Clifton High School", 
      address: "333 Colfax Avenue", 
      visits: 3, 
      hours: 21.5,
      // These coordinates are adjusted to match Image 3
      position: { top: "58%", left: "42%" },
      technicians: ["Rupert Chandool", "Richard Bhajan"],
      color: '#FF3333' // High hours
    },
    { 
      id: 2, 
      name: "Clifton Stadium Weight Room", 
      address: "350 Piaget Avenue", 
      visits: 2, 
      hours: 9,
      position: { top: "43%", left: "45%" },
      technicians: ["Rupert Chandool", "Threshan Ramsarran"],
      color: '#3399FF' // Medium hours
    },
    { 
      id: 3, 
      name: "Clifton Public School #1", 
      address: "158 Park Slope", 
      visits: 2, 
      hours: 8,
      position: { top: "43%", left: "38%" },
      technicians: ["Rupert Chandool"],
      color: '#3399FF' // Medium hours
    },
    { 
      id: 4, 
      name: "Clifton Public School #3", 
      address: "365 Washington Avenue", 
      visits: 2, 
      hours: 6,
      position: { top: "48%", left: "44%" },
      technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran"],
      color: '#66CCFF' // Low hours
    },
    { 
      id: 5, 
      name: "Clifton Public School #4", 
      address: "194 West 2nd Street", 
      visits: 2, 
      hours: 5,
      position: { top: "37%", left: "40%" },
      technicians: ["Rupert Chandool", "Henry Sanchez"],
      color: '#66CCFF' // Low hours
    },
    { 
      id: 6, 
      name: "Clifton Public School #5", 
      address: "136 Valley Road", 
      visits: 3, 
      hours: 9,
      position: { top: "31%", left: "35%" },
      technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran"],
      color: '#3399FF' // Medium hours
    },
    { 
      id: 7, 
      name: "Clifton Public School #9", 
      address: "25 Brighton Road", 
      visits: 2, 
      hours: 8,
      position: { top: "83%", left: "40%" },
      technicians: ["Rupert Chandool"],
      color: '#3399FF' // Medium hours
    },
    { 
      id: 8, 
      name: "Clifton Public School #11", 
      address: "147 Merselis Avenue", 
      visits: 3, 
      hours: 15.5,
      position: { top: "43%", left: "53%" },
      technicians: ["Rupert Chandool", "Threshan Ramsarran"],
      color: '#3399FF' // Medium hours
    },
    { 
      id: 9, 
      name: "Clifton Public School #14", 
      address: "99 Saint Andrews Blvd", 
      visits: 3, 
      hours: 7,
      position: { top: "70%", left: "40%" },
      technicians: ["Rupert Chandool"],
      color: '#66CCFF' // Low hours
    }
  ];

  return (
    <div className="relative">
      <h3 className="text-lg font-bold uppercase mb-1 text-black">GEOGRAPHIC SERVICE DISTRIBUTION</h3>
      <p className="text-sm text-gray-600 mb-4">March-April 2025 | Clifton Public Schools</p>

      <div className="relative h-96 border border-gray-300 rounded-lg overflow-hidden">
        {/* Using the satellite map from Image 3 */}
        <img 
          src="https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/clifton-satellite-map.jpg" 
          alt="Clifton Schools Map"
          className="w-full h-full object-cover"
        />
        
        {/* School location markers matching the positions in Image 3 */}
        {updatedSchoolData.map(school => (
          <div 
            key={school.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
            style={{
              top: school.position.top,
              left: school.position.left,
              zIndex: selectedSchool === school.id ? 50 : 10
            }}
            onClick={() => setSelectedSchool(school.id)}
          >
            {/* Circular marker with appropriate color */}
            <div 
              className="w-6 h-6 rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
              style={{ backgroundColor: school.color }}
            />
          </div>
        ))}
        
        {/* School info popup - styled to match Image 1 */}
        {selectedSchool && (
          <div className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-lg shadow-lg z-50 border border-gray-300">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-black">
                  {updatedSchoolData.find(s => s.id === selectedSchool)?.name}
                </h4>
                <p className="text-sm">
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
            <div className="flex justify-between mt-3 text-sm">
              <span>Visits: <b>{updatedSchoolData.find(s => s.id === selectedSchool)?.visits}</b></span>
              <span>Hours: <b>{updatedSchoolData.find(s => s.id === selectedSchool)?.hours}</b></span>
            </div>
            <div className="mt-1 text-xs text-gray-600">
              Technicians: {updatedSchoolData.find(s => s.id === selectedSchool)?.technicians.join(", ")}
            </div>
          </div>
        )}
        
        {/* Map legend - styled to match Image 1 */}
        <div className="absolute top-2 right-2 bg-white p-2 rounded shadow-md text-xs">
          <div className="font-bold mb-1">Service Hours</div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 rounded-full mr-1" style={{backgroundColor: '#66CCFF'}}></div>
            <span>Low (1-7 hrs)</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 rounded-full mr-1" style={{backgroundColor: '#3399FF'}}></div>
            <span>Medium (8-15 hrs)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-1" style={{backgroundColor: '#FF3333'}}></div>
            <span>High (16+ hrs)</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-700">
        <p>This map displays service intensity across the nine Clifton Public School locations that received HVAC maintenance visits from March-April 2025. The color intensity of each marker represents the total service hours at that location, with red indicating high service hours.</p>
        <p className="mt-2"><b>Note:</b> Click on any school marker to view details about the service at that location.</p>
      </div>
    </div>
  );
};

export default MapView;