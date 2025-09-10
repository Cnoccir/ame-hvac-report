import React, { useState } from 'react';
import AmeLogo from './AmeLogo';
import { Printer, Menu, X } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, reportDate = "March-May 2025", clientName = "Clifton Public Schools" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'executive-summary', name: 'Executive Summary', icon: 'file-text' },
    { id: 'system-inventory', name: 'System Inventory', icon: 'package' },
    { id: 'service-metrics', name: 'Service Metrics', icon: 'bar-chart' },
    { id: 'service-timeline', name: 'Service Timeline', icon: 'calendar' },
    { id: 'issue-analysis', name: 'Issue Analysis', icon: 'alert-triangle' },
    { id: 'visit-logs', name: 'Visit Logs', icon: 'clipboard' },
    { id: 'school-map', name: 'School Map', icon: 'map' },
  ];

  const enablePdf = process.env.NEXT_PUBLIC_PDF_EXPORT === 'true';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const id = 'clifton-2025';
    window.open(`/api/export/pdf?id=${encodeURIComponent(id)}`, '_blank');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Company Info */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AmeLogo size="small" />
            </div>
            <div className="ml-4 hidden md:block">
              <h1 className="text-lg font-semibold text-navy">HVAC SERVICE REPORT</h1>
              <p className="text-xs text-gray-600">{reportDate} | {clientName}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-navy text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
            <button
              onClick={handlePrint}
              className="ml-4 px-4 py-2 bg-red text-white text-sm font-medium rounded-md flex items-center"
            >
              <Printer size={16} className="mr-2" />
              Print Report
            </button>
            {enablePdf && (
              <button
                onClick={handleDownloadPdf}
                className="ml-2 px-4 py-2 bg-navy text-white text-sm font-medium rounded-md"
                title="Download branded PDF"
              >
                Download PDF
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-lg border-t border-gray-200">
          <h1 className="text-lg font-semibold text-navy mb-1">HVAC SERVICE REPORT</h1>
          <p className="text-xs text-gray-600 mb-4">{reportDate} | {clientName}</p>
          
          <nav className="flex flex-col space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-navy text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
            <button
              onClick={handlePrint}
              className="mt-4 px-4 py-2 bg-red text-white text-sm font-medium rounded-md flex items-center justify-center"
            >
              <Printer size={16} className="mr-2" />
              Print Report
            </button>
            {enablePdf && (
              <button
                onClick={handleDownloadPdf}
                className="mt-2 px-4 py-2 bg-navy text-white text-sm font-medium rounded-md w-full"
                title="Download branded PDF"
              >
                Download PDF
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;