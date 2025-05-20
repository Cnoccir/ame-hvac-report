import React from 'react';
import AmeLogo from './AmeLogo';

const ExecutiveSummary = ({ 
  schoolCount = 11,
  totalVisits = 31,
  totalHours = 236.5,
  onSiteHours = 148.5,
  remoteHours = 88,
  startDate = "July 2024",
  endDate = "May 2025",
  clientName = "Clifton Public Schools"
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Executive Summary Header */}
      <div className="bg-navy text-white p-4">
        <h2 className="text-xl font-bold text-center">EXECUTIVE SUMMARY</h2>
        <p className="text-sm text-center text-gray-300">
          {startDate} - {endDate} | {clientName}
        </p>
      </div>

      {/* Company Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-gray-200">
        <div className="col-span-1">
          <AmeLogo size="large" />
        </div>
        <div className="col-span-1">
          <h3 className="font-bold text-black">AME Inc.</h3>
          <p className="text-sm text-gray-600">175 Bloomfield Ave., Building 2 Suite 17B</p>
          <p className="text-sm text-gray-600">Nutley, NJ 07110</p>
          <p className="text-sm text-gray-600">Tel: (973) 661-4100</p>
        </div>
        <div className="col-span-1 bg-gray-50 p-4 rounded border-l-4 border-red">
          <h3 className="font-bold text-black">HVAC SERVICE REPORT</h3>
          <p className="text-sm text-gray-600">{clientName} | {startDate} - {endDate}</p>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-navy">{schoolCount}</div>
          <div className="text-sm text-gray-600">Schools Serviced</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-navy">{totalVisits}</div>
          <div className="text-sm text-gray-600">On-Site Visits</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-navy">{onSiteHours}</div>
          <div className="text-sm text-gray-600">On-Site Hours</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-navy">{remoteHours}</div>
          <div className="text-sm text-gray-600">Remote Support Hours</div>
        </div>
      </div>

      {/* Executive Summary Content */}
      <div className="p-6">
        <div className="mb-4">
          <p className="mb-4">
            <strong>AME Inc.</strong> has successfully delivered comprehensive HVAC building automation maintenance services to Clifton Board of Education across 11 school facilities. This report summarizes our maintenance activities conducted from {startDate} through {endDate}, encompassing both on-site visits and remote technical support services.
          </p>
          <p className="mb-4">
            Our maintenance program consisted of two key components: <strong>{onSiteHours} hours</strong> of on-site technical visits and <strong>{remoteHours} hours</strong> of remote advanced support by our team. This combined approach enabled us to address both immediate maintenance needs and provide high-level system optimization.
          </p>
        </div>
        <div className="mb-4">
          <h4 className="font-bold text-navy mb-2">Through our maintenance efforts, we successfully addressed numerous critical issues, including:</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Resolution of BACnet communication failures</strong> affecting entire wing at Clifton High School</li>
            <li><strong>Identification and documentation of controller requirements</strong> for multiple VAV systems</li>
            <li><strong>Optimization of JACE performance</strong>, reducing CPU usage from 100% to 23% at School #11</li>
            <li><strong>Troubleshooting of freeze stat issues</strong> affecting multiple units at temperatures up to 58°F</li>
            <li><strong>Comprehensive system coordination</strong> across all mechanical components</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-navy mb-2">Our team identified several system improvements that would enhance comfort and reliability, including:</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>Controller upgrades, freeze stat calibration, and mechanical system coordination</li>
            <li>Comprehensive inspection and recalibration of all freeze stats</li>
            <li>Replacement of defective CVL4022AS controllers and associated thermostats</li>
            <li>Accelerated Daikin VRV/VRF integration project before cooling season</li>
          </ul>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded border-l-4 border-blue">
          <h4 className="font-bold text-navy mb-2">Advanced Remote Support Value</h4>
          <p>
            The advanced remote support component of our service has been particularly valuable in providing proactive system monitoring, technical guidance for on-site personnel, performance optimization, and backup management - ensuring these critical building systems continue to operate at peak efficiency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;