import React, { useState } from 'react';
import Header from './Header';
import UserGuide from './UserGuide';
import ExecutiveSummary from './ExecutiveSummary';
import { LineChart, BarChart2, Map, FileText, AlertTriangle, Clipboard, HardDrive } from 'lucide-react';

const ReportLayout = ({ 
  children,
  schoolData,
  visitData,
  issueData,
  clientName = "Clifton Public Schools",
  reportDate = "March-May 2025"
}) => {
  const [activeTab, setActiveTab] = useState('executive-summary');

  // Calculate total metrics for the Executive Summary
  const totalVisits = visitData.length;
  const totalHours = visitData.reduce((sum, visit) => sum + visit.hours, 0);
  const onSiteHours = Math.round(totalHours * 0.63); // 63% of hours are on-site based on data
  const remoteHours = Math.round(totalHours * 0.37); // 37% of hours are remote based on data
  const schoolCount = schoolData.length;
  
  // Map tabs to content components
  const getTabContent = () => {
    switch (activeTab) {
      case 'executive-summary':
        return (
          <>
            <UserGuide />
            <ExecutiveSummary 
              schoolCount={schoolCount}
              totalVisits={totalVisits}
              totalHours={totalHours}
              onSiteHours={onSiteHours}
              remoteHours={remoteHours}
              clientName={clientName}
            />
          </>
        );      case 'system-inventory':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <HardDrive size={24} className="mr-2 text-navy" />
              <h2 className="text-xl font-bold">System Inventory</h2>
            </div>
            <p className="text-gray-500 mb-6">Comprehensive inventory of HVAC systems across all schools</p>
            {/* System Inventory content would go here */}
            <div className="p-12 text-center text-gray-400">
              System Inventory content will be displayed here
            </div>
          </div>
        );
      case 'service-metrics':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <BarChart2 size={24} className="mr-2 text-navy" />
              <h2 className="text-xl font-bold">Service Metrics</h2>
            </div>
            <p className="text-gray-500 mb-6">Detailed analysis of service hours, visits, and performance</p>
            {/* Service Metrics content would go here */}
            <div className="p-12 text-center text-gray-400">
              Service Metrics content will be displayed here
            </div>
          </div>
        );
      case 'service-timeline':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <LineChart size={24} className="mr-2 text-navy" />
              <h2 className="text-xl font-bold">Service Timeline</h2>
            </div>
            <p className="text-gray-500 mb-6">Chronological view of all maintenance activities</p>
            {/* Service Timeline content would go here */}
            <div className="p-12 text-center text-gray-400">
              Service Timeline content will be displayed here
            </div>
          </div>
        );      case 'issue-analysis':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle size={24} className="mr-2 text-navy" />
              <h2 className="text-xl font-bold">Issue Analysis</h2>
            </div>
            <p className="text-gray-500 mb-6">Prioritized analysis of technical issues and recommendations</p>
            {/* Issue Analysis content would go here */}
            <div className="p-12 text-center text-gray-400">
              Issue Analysis content will be displayed here
            </div>
          </div>
        );
      case 'visit-logs':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Clipboard size={24} className="mr-2 text-navy" />
              <h2 className="text-xl font-bold">Visit Logs</h2>
            </div>
            <p className="text-gray-500 mb-6">Detailed documentation of each service visit</p>
            {/* Visit Logs content would go here */}
            <div className="p-12 text-center text-gray-400">
              Visit Logs content will be displayed here
            </div>
          </div>
        );
      case 'school-map':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Map size={24} className="mr-2 text-navy" />
              <h2 className="text-xl font-bold">School Map</h2>
            </div>
            <p className="text-gray-500 mb-6">Geographic view of serviced locations</p>
            {/* School Map content would go here */}
            <div className="p-12 text-center text-gray-400">
              School Map content will be displayed here
            </div>
          </div>
        );      default:
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <p className="text-gray-400 text-center">Select a tab to view content</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        reportDate={reportDate}
        clientName={clientName}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {getTabContent()}
        
        {/* Custom child content if provided */}
        {children}
      </main>
      
      <footer className="bg-navy text-white py-4 mt-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-2 md:mb-0">AME Inc. | 175 Bloomfield Ave., Building 2 Suite 17B | Nutley, NJ 07110</p>
          <p className="text-sm">Copyright 2025 AME-INC. All Rights Reserved</p>
        </div>
      </footer>

      {/* Print-only footer that appears on every printed page */}
      <div className="hidden print:block fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 text-center">
        <p className="text-sm text-gray-600">
          AME Inc. HVAC Service Report | {clientName} | {reportDate}
        </p>
      </div>
    </div>
  );
};

export default ReportLayout;