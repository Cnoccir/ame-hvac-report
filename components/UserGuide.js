import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const UserGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleGuide = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6 print:hidden">
      <button 
        onClick={toggleGuide}
        className="w-full flex justify-between items-center p-4 text-left font-medium text-navy hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <HelpCircle size={20} className="mr-2 text-red" />
          <span>How to Use This Report</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <p className="mb-4">
            This HVAC Service Report provides a comprehensive overview of maintenance activities
            performed by AME Inc. for Clifton Public Schools. Here's how to navigate and use this report:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-navy mb-2">Navigation:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Executive Summary:</strong> Overview of service activities and key achievements</li>
                <li><strong>System Inventory:</strong> Equipment inventory across all schools</li>
                <li><strong>Service Metrics:</strong> Quantitative data on service hours and visits</li>
                <li><strong>Service Timeline:</strong> Chronological view of all maintenance visits</li>
                <li><strong>Issue Analysis:</strong> Breakdown of technical issues identified</li>
                <li><strong>Visit Logs:</strong> Detailed notes from each service visit</li>
                <li><strong>School Map:</strong> Geographic view of all serviced locations</li>
              </ul>
            </div>            
            <div>
              <h4 className="font-bold text-navy mb-2">Key Features:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Charts & Graphs:</strong> Visual representations of service data</li>
                <li><strong>Interactive Map:</strong> Location-based view of service activities</li>
                <li><strong>Print Report:</strong> Generate a printable version for distribution</li>
                <li><strong>Mobile Friendly:</strong> Responsive design for all device types</li>
                <li><strong>Issue Tracking:</strong> Prioritized view of system issues</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded border-l-4 border-blue">
            <h4 className="font-bold text-navy mb-2">Suggested Uses:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Facilities Management:</strong> Track maintenance history and plan future improvements</li>
              <li><strong>Budget Planning:</strong> Analyze service patterns to optimize maintenance budgets</li>
              <li><strong>Issue Resolution:</strong> Identify and address recurring technical problems</li>
              <li><strong>Service Verification:</strong> Document completed maintenance activities</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGuide;