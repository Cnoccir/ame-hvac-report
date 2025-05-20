import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building, Server, HardDrive, Database, ChevronDown, ChevronRight, Circle, Info, Wifi, Clock, Activity, ArrowRight } from 'lucide-react';

// AME Inc. brand colors
const COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  lightGrey: "#F2F2F2",
  mediumGrey: "#DDDDDD",
  darkGrey: "#777777",
  red: "#E83A3A",
  navy: "#1D0F5A",
  blue: "#3A6EE8",
  lightBlue: "#6AAFE8",
  gray: "#666666",
  green: "#4CAF50",
  yellow: "#FFC107",
  orange: "#FF9800",
  // Additional colors for charts
  chartColors: ["#E83A3A", "#3A6EE8", "#1D0F5A", "#6AAFE8", "#97C2FC", "#B4E1FF", "#FF9800", "#FFA07A", "#4CAF50", "#87CEFA"]
};

// Supervisors data exactly as shown in the screenshot
const supervisorsData = [
  { 
    name: "Clifton_BOE", 
    address: "ip:10.10.29.79", 
    hostModel: "TITAN", 
    version: "4.13.2.18", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:36 AM EDT]",
    clientConn: "Connected",
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_1", 
    address: "ip:10.10.14.65", 
    hostModel: "TITAN", 
    version: "4.13.2.18", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:38 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_2", 
    address: "ip:10.10.16.66", 
    hostModel: "TITAN", 
    version: "4.13.2.18", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:36 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_3", 
    address: "ip:10.10.17.67", 
    hostModel: "TITAN", 
    version: "4.13.2.18", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:36 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_4", 
    address: "ip:10.10.18.68", 
    hostModel: "TITAN", 
    version: "4.13.2.18", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:36 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_5", 
    address: "ip:10.10.19.69", 
    hostModel: "TITAN", 
    version: "4.13.2.18.3", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:37 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_9", 
    address: "ip:10.10.21.71", 
    hostModel: "TITAN", 
    version: "4.13.2.18", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:36 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_11", 
    address: "ip:10.10.22.72", 
    hostModel: "TITAN", 
    version: "4.13.2.18", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:38 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_12", 
    address: "ip:10.10.24.74", 
    hostModel: "TITAN", 
    version: "4.13.2.18", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:38 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_14", 
    address: "ip:10.10.26.76", 
    hostModel: "TITAN", 
    version: "4.13.2.18", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:36 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_16", 
    address: "ip:10.10.28.78", 
    hostModel: "TITAN", 
    version: "4.13.2.18.3", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:36 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "Woodrow Wilson Field House", 
    address: "ip:10.10.31.81", 
    hostModel: "TITAN", 
    version: "4.13.2.18.3", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:36 AM EDT]",
    clientConn: "Not connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_Jace1", 
    address: "ip:10.10.13.63", 
    hostModel: "TITAN", 
    version: "4.13.2.18.3", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:35 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_5", 
    address: "ip:10.10.19.69", 
    hostModel: "TITAN", 
    version: "4.13.2.18.3", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:37 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchools_Pkg1_Jace2", 
    address: "ip:10.10.13.64", 
    hostModel: "TITAN", 
    version: "4.13.2.18.3", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:36 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonHighSchoolHWS", 
    address: "ip:10.10.13.65", 
    hostModel: "nxubc", 
    version: "4.13.2.18", 
    status: "(down)",
    health: "OK [19-May-25 7:28 AM EDT] Mismatched station names: Clifton_School_1 != CliftonSchool_1",
    clientConn: "Not connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonStadium", 
    address: "ip:10.10.30.80", 
    hostModel: "TITAN", 
    version: "4.13.2.18", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:37 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "Clifton_School_1", 
    address: "ip:10.10.14.65", 
    hostModel: "nxubc", 
    version: "4.13.2.18", 
    status: "(down)",
    health: "Fail [19-May-25 7:28 AM EDT] Mismatched station names: Clifton_School_1 != CliftonSchool_1",
    clientConn: "Not connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonHS_Jace3", 
    address: "ip:10.10.13.84", 
    hostModel: "TITAN", 
    version: "4.13.2.18.3", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:36 AM EDT]",
    clientConn: "Not connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "Sch12_HWS", 
    address: "ip:10.10.24.73", 
    hostModel: "nxubc", 
    version: "4.13.2.18", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:36 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "Clifton_CCMS", 
    address: "ip:10.10.32.82", 
    hostModel: "TITAN", 
    version: "4.13.2.18.3", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:37 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "Clifton_WWMS", 
    address: "ip:10.10.33.83", 
    hostModel: "TITAN", 
    version: "4.13.2.18.3", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:37 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_13", 
    address: "ip:10.10.25.75", 
    hostModel: "TITAN", 
    version: "4.13.2.18", 
    status: "(unackedAlarm)",
    health: "OK [19-May-25 7:37 AM EDT]",
    clientConn: "Connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "Clifton_Supervisor", 
    address: "DESKTOP-1V93ALP", 
    hostModel: "", 
    version: "", 
    status: "(disabled,fault)",
    health: "Fail [null]",
    clientConn: "Not connected", 
    serverConn: "Not connected" 
  },
  { 
    name: "CliftonSchool_8", 
    address: "", 
    hostModel: "", 
    version: "", 
    status: "(disabled)",
    health: "Fail [null]",
    clientConn: "Not connected", 
    serverConn: "Not connected" 
  }
];

// Accurate device counts based on the Excel files
const deviceData = {
  'CliftonSchool_1': {
    devices: 9,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 3, points: 143 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 6, points: 209 }
    ],
    points: 352
  },
  'CliftonSchool_2': {
    devices: 8,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 3, points: 125 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 5, points: 175 }
    ],
    points: 300
  },
  'CliftonSchool_3': {
    devices: 12,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 7, points: 325 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 5, points: 195 }
    ],
    points: 520
  },
  'CliftonSchool_4': {
    devices: 10,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 4, points: 148 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 6, points: 230 }
    ],
    points: 378
  },
  'CliftonSchool_5': {
    devices: 11,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 6, points: 280 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 5, points: 212 }
    ],
    points: 492
  },
  'CliftonSchool_9': {
    devices: 7,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 4, points: 184 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 3, points: 100 }
    ],
    points: 284
  },
  'CliftonSchool_11': {
    devices: 8,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 5, points: 215 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 3, points: 110 }
    ],
    points: 325
  },
  'CliftonSchool_12': {
    devices: 6,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 4, points: 168 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 2, points: 80 }
    ],
    points: 248
  },
  'CliftonSchool_13': {
    devices: 5,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 3, points: 120 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 2, points: 85 }
    ],
    points: 205
  },
  'CliftonSchool_14': {
    devices: 8,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 4, points: 162 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 4, points: 150 }
    ],
    points: 312
  },
  'CliftonSchool_16': {
    devices: 6,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 3, points: 118 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 3, points: 120 }
    ],
    points: 238
  },
  'Clifton_highschool_1': {
    devices: 35,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 20, points: 723 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 15, points: 520 }
    ],
    points: 1243
  },
  'Clifton_highschool_2': {
    devices: 28,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 16, points: 585 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 12, points: 400 }
    ],
    points: 985
  },
  'Clifton_highschool_3': {
    devices: 31,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 18, points: 650 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 13, points: 470 }
    ],
    points: 1120
  },
  'CliftonStadium': {
    devices: 5,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 3, points: 95 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 2, points: 50 }
    ],
    points: 145
  },
  'Woodrow Wilson Field House': {
    devices: 4,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 2, points: 75 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 2, points: 85 }
    ],
    points: 160
  },
  'CliftonHighSchoolHWS': {
    devices: 18,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 10, points: 425 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 8, points: 355 }
    ],
    points: 780
  },
  'Sch12_HWS': {
    devices: 12,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 7, points: 280 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 5, points: 215 }
    ],
    points: 495
  },
  'Clifton_CCMS': {
    devices: 14,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 8, points: 310 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 6, points: 265 }
    ],
    points: 575
  },
  'Clifton_WWMS': {
    devices: 16,
    trunks: [
      { name: 'BacnetNetwork-MstpTrunk1', devices: 9, points: 385 },
      { name: 'BacnetNetwork-MstpTrunk2', devices: 7, points: 295 }
    ],
    points: 680
  }
};

// Section Title Component
const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-bold uppercase mb-1 text-black">{children}</h3>
);

// Section Subtitle Component
const SectionSubtitle = ({ children }) => (
  <p className="text-sm text-gray-600 mb-4">Clifton Public Schools District</p>
);

// Subheading Component
const Subheading = ({ children }) => (
  <h4 className="font-bold text-base mb-2 text-black">{children}</h4>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  let color = "gray";
  
  if (status.includes("down")) {
    color = "red";
  } else if (status.includes("unackedAlarm")) {
    color = "orange";
  } else if (status === "OK") {
    color = "green";
  }
  
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full bg-${color}-100 text-${color}-800`}>
      {status}
    </span>
  );
};

// Connection Status Component
const ConnectionStatus = ({ connected }) => {
  const color = connected === "Connected" ? "green" : "gray";
  return (
    <div className="flex items-center">
      <div className={`w-2 h-2 rounded-full bg-${color}-500 mr-2`}></div>
      <span className="text-sm">{connected}</span>
    </div>
  );
};

// Health Status Component
const HealthStatus = ({ health }) => {
  const isFailed = health.toLowerCase().includes('fail');
  const color = isFailed ? "red" : "green";
  
  return (
    <div className="flex items-center">
      <div className={`w-2 h-2 rounded-full bg-${color}-500 mr-2`}></div>
      <span className="text-sm truncate" title={health}>
        {health.length > 40 ? health.substring(0, 40) + '...' : health}
      </span>
    </div>
  );
};

// Inventory Summary Component
const InventorySummary = () => {
  const [activeTab, setActiveTab] = useState('district');
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [expandedTrunks, setExpandedTrunks] = useState({});
  const [expandedDevices, setExpandedDevices] = useState({});
  const [schoolDeviceData, setSchoolDeviceData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize with the first supervisor
  useEffect(() => {
    if (supervisorsData.length > 0 && !selectedSupervisor) {
      setSelectedSupervisor(supervisorsData[0]);
    }
  }, []);
  
  // Initialize the school device data with the actual data
  useEffect(() => {
    setIsLoading(true);
    
    const processedData = {};
    
    // Map JACE (supervisor) names to their corresponding data
    supervisorsData.forEach(supervisor => {
      const schoolName = supervisor.name;
      let data = null;
      
      // Try to find matching data
      if (deviceData[schoolName]) {
        data = deviceData[schoolName];
      } else if (schoolName === 'CliftonHighSchoolHWS') {
        data = deviceData['CliftonHighSchoolHWS'];
      } else if (schoolName === 'CliftonHS_Jace3') {
        data = deviceData['Clifton_highschool_3'];
      } else if (schoolName === 'CliftonSchool_Jace1') {
        data = deviceData['Clifton_highschool_1'];
      } else if (schoolName === 'CliftonSchools_Pkg1_Jace2') {
        data = deviceData['Clifton_highschool_2'];
      } else {
        // Default data for entries without specific data
        data = {
          devices: 0,
          trunks: [
            { name: 'BacnetNetwork-MstpTrunk1', devices: 0, points: 0 },
            { name: 'BacnetNetwork-MstpTrunk2', devices: 0, points: 0 }
          ],
          points: 0
        };
      }
      
      processedData[schoolName] = {
        stationName: schoolName,
        devices: data.devices,
        points: data.points,
        trunks: data.trunks
      };
    });
    
    setSchoolDeviceData(processedData);
    setIsLoading(false);
  }, []);
  
  // Calculate district stats
  const districtStats = React.useMemo(() => {
    // Count total devices and points
    let totalDevices = 0;
    let totalPoints = 0;
    const modelCounts = {};
    const versionCounts = {};
    const connectionStatusCounts = { Connected: 0, "Not connected": 0 };
    const statusCounts = {};
    
    // Process school data
    Object.values(schoolDeviceData).forEach(school => {
      totalDevices += school.devices;
      totalPoints += school.points;
    });
    
    // Process supervisor data
    supervisorsData.forEach(supervisor => {
      // Count by model
      if (supervisor.hostModel) {
        if (!modelCounts[supervisor.hostModel]) {
          modelCounts[supervisor.hostModel] = 0;
        }
        modelCounts[supervisor.hostModel]++;
      }
      
      // Count by version
      if (supervisor.version) {
        if (!versionCounts[supervisor.version]) {
          versionCounts[supervisor.version] = 0;
        }
        versionCounts[supervisor.version]++;
      }
      
      // Count by status
      const statusKey = supervisor.status || "unknown";
      if (!statusCounts[statusKey]) {
        statusCounts[statusKey] = 0;
      }
      statusCounts[statusKey]++;
      
      // Count by connection status
      connectionStatusCounts[supervisor.clientConn]++;
    });
    
    return {
      totalSupervisors: supervisorsData.length,
      totalDevices,
      totalPoints,
      modelCounts,
      versionCounts,
      statusCounts,
      connectionStatusCounts
    };
  }, [schoolDeviceData]);
  
  // Prepare chart data
  const modelChartData = React.useMemo(() => {
    return Object.entries(districtStats.modelCounts || {}).map(([model, count]) => ({
      name: model || "Unknown",
      value: count
    }));
  }, [districtStats]);
  
  const versionChartData = React.useMemo(() => {
    return Object.entries(districtStats.versionCounts || {}).map(([version, count]) => ({
      name: version || "Unknown",
      value: count
    }));
  }, [districtStats]);
  
  const statusChartData = React.useMemo(() => {
    return Object.entries(districtStats.statusCounts || {}).map(([status, count]) => ({
      name: status,
      value: count
    }));
  }, [districtStats]);
  
  const connectionChartData = React.useMemo(() => {
    return Object.entries(districtStats.connectionStatusCounts || {}).map(([status, count]) => ({
      name: status,
      value: count
    }));
  }, [districtStats]);
  
  const schoolDeviceChartData = React.useMemo(() => {
    const filteredData = Object.entries(schoolDeviceData)
      .filter(([name, data]) => {
        // Only include schools with actual device data
        return data.devices > 0 && 
               !name.includes('Supervisor') && 
               !name.includes('CliftonSchool_8');
      })
      .map(([school, data]) => {
        // Properly format the school name for display
        let displayName = school;
        if (school.includes('CliftonSchool_')) {
          displayName = 'School #' + school.replace('CliftonSchool_', '');
        } else if (school.includes('highschool')) {
          displayName = 'High School';
        } else if (school.includes('CliftonHighSchool')) {
          displayName = 'High School';
        } else if (school === 'CliftonStadium') {
          displayName = 'Stadium';
        }
        
        return {
          name: displayName,
          devices: data.devices,
          points: data.points
        };
      })
      .sort((a, b) => b.devices - a.devices);
    
    // Take top 10 for better readability
    return filteredData.slice(0, 10);
  }, [schoolDeviceData]);
  
  // Toggle trunk expansion
  const toggleTrunkExpansion = (trunkId) => {
    setExpandedTrunks({
      ...expandedTrunks,
      [trunkId]: !expandedTrunks[trunkId]
    });
  };
  
  // Toggle device expansion
  const toggleDeviceExpansion = (deviceId) => {
    setExpandedDevices({
      ...expandedDevices,
      [deviceId]: !expandedDevices[deviceId]
    });
  };
  
  return (
    <div className="p-4">
      <SectionTitle>INVENTORY SUMMARY</SectionTitle>
      <SectionSubtitle />
      
      {/* Tabs for views */}
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'district' ? 'text-red border-b-2 border-red' : 'text-gray'}`}
          onClick={() => setActiveTab('district')}
        >
          District Overview
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'supervisors' ? 'text-red border-b-2 border-red' : 'text-gray'}`}
          onClick={() => setActiveTab('supervisors')}
        >
          JACE Information
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'devices' ? 'text-red border-b-2 border-red' : 'text-gray'}`}
          onClick={() => {
            if (selectedSupervisor) {
              setActiveTab('devices');
            } else if (supervisorsData.length > 0) {
              setSelectedSupervisor(supervisorsData[0]);
              setActiveTab('devices');
            }
          }}
        >
          Device Tree
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red mb-4"></div>
            <p className="text-gray-600">Loading inventory data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* District Overview Tab */}
          {activeTab === 'district' && (
            <div>
              {/* Summary stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-red">
                  <div className="text-3xl font-bold text-black">{supervisorsData.length}</div>
                  <div className="text-sm font-medium text-gray-600">JACE Devices</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-blue">
                  <div className="text-3xl font-bold text-black">{districtStats.totalDevices}</div>
                  <div className="text-sm font-medium text-gray-600">BACnet Devices</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-green">
                  <div className="text-3xl font-bold text-black">{districtStats.totalPoints}</div>
                  <div className="text-sm font-medium text-gray-600">Data Points</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-orange">
                  <div className="text-3xl font-bold text-black">{districtStats.connectionStatusCounts?.Connected || 0}</div>
                  <div className="text-sm font-medium text-gray-600">Connected Systems</div>
                </div>
              </div>
              
              {/* Charts row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                  <Subheading>Hardware Models</Subheading>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={modelChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {modelChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} JACE${value !== 1 ? 's' : ''}`, 'Model']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                  <Subheading>Version Distribution</Subheading>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={versionChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {versionChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} JACE${value !== 1 ? 's' : ''}`, 'Version']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                  <Subheading>Connection Status</Subheading>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={connectionChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {connectionChartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.name === "Connected" ? COLORS.green : COLORS.gray} 
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} JACE${value !== 1 ? 's' : ''}`, 'Status']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                  <Subheading>JACE Status</Subheading>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.name.includes("down") ? COLORS.red : 
                                    entry.name.includes("unackedAlarm") ? COLORS.orange : 
                                    COLORS.green} 
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} JACE${value !== 1 ? 's' : ''}`, 'Status']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Device count by school chart */}
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
                <Subheading>Device & Point Count by School</Subheading>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={schoolDeviceChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis yAxisId="left" orientation="left" stroke={COLORS.blue} />
                      <YAxis yAxisId="right" orientation="right" stroke={COLORS.red} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="devices" name="Devices" fill={COLORS.blue} />
                      <Bar yAxisId="right" dataKey="points" name="Points" fill={COLORS.red} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          
          {/* JACE Information Tab */}
          {activeTab === 'supervisors' && (
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <div className="p-4 border-b">
                <Subheading>JACE Status</Subheading>
                <p className="text-sm text-gray-600">Current status of all JACEs in the Clifton Public Schools Building Automation System</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">JACE</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">IP ADDRESS</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">HOST MODEL</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">VERSION</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">STATUS</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">HEALTH</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">CLIENT CONN</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">SERVER CONN</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {supervisorsData.map((supervisor, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm text-black">
                          {supervisor.name}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-black">
                          {supervisor.address}
                        </td>
                        <td className="px-4 py-3 text-sm text-black">
                          {supervisor.hostModel}
                        </td>
                        <td className="px-4 py-3 text-sm text-black">
                          {supervisor.version}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <StatusBadge status={supervisor.status} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <HealthStatus health={supervisor.health} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <ConnectionStatus connected={supervisor.clientConn} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <ConnectionStatus connected={supervisor.serverConn} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {schoolDeviceData[supervisor.name]?.devices > 0 ? (
                            <button 
                              className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={() => {
                                setSelectedSupervisor(supervisor);
                                setActiveTab('devices');
                              }}
                            >
                              <span className="mr-1">View Devices</span>
                              <ArrowRight size={14} />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-500">No devices</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Device Tree Tab */}
          {activeTab === 'devices' && selectedSupervisor && (
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <div className="p-4 border-b">
                <Subheading>Device Tree for {selectedSupervisor.name}</Subheading>
                <div className="flex items-center text-sm text-gray-600 flex-wrap">
                  <div className="flex items-center mr-4 my-1">
                    <Server className="h-4 w-4 mr-1" />
                    <span>{selectedSupervisor.address}</span>
                  </div>
                  <div className="flex items-center mr-4 my-1">
                    <HardDrive className="h-4 w-4 mr-1" />
                    <span>{selectedSupervisor.hostModel}</span>
                  </div>
                  <div className="flex items-center mr-4 my-1">
                    <Info className="h-4 w-4 mr-1" />
                    <span>{selectedSupervisor.version}</span>
                  </div>
                  <div className="flex items-center my-1">
                    <Circle className="h-4 w-4 mr-1" />
                    <span>{schoolDeviceData[selectedSupervisor.name]?.devices || 0} Devices / {schoolDeviceData[selectedSupervisor.name]?.points || 0} Points</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {selectedSupervisor && schoolDeviceData[selectedSupervisor.name]?.devices > 0 ? (
                  <div>
                    <div className="mb-4 p-3 border rounded-lg bg-gray-50">
                      <div className="flex flex-wrap justify-between mb-2">
                        <div className="mr-4 mb-2">
                          <span className="font-medium">Total Devices:</span> 
                          <span className="ml-2">{schoolDeviceData[selectedSupervisor.name].devices}</span>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">Total Points:</span> 
                          <span className="ml-2">{schoolDeviceData[selectedSupervisor.name].points}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Trunk listing */}
                    <div className="mb-4">
                      {schoolDeviceData[selectedSupervisor.name].trunks.map((trunk, index) => (
                        <div key={index} className="mb-2 border rounded-lg overflow-hidden">
                          <div 
                            className="p-3 flex justify-between items-center cursor-pointer bg-gray-100 hover:bg-gray-200"
                            onClick={() => toggleTrunkExpansion(`${selectedSupervisor.name}-${trunk.name}`)}
                          >
                            <div className="flex items-center">
                              {expandedTrunks[`${selectedSupervisor.name}-${trunk.name}`] ? 
                                <ChevronDown className="h-4 w-4 mr-2" /> : 
                                <ChevronRight className="h-4 w-4 mr-2" />
                              }
                              <span className="font-medium">{trunk.name}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600 mr-4">{trunk.devices} Devices</span>
                              <span className="text-sm text-gray-600">{trunk.points} Points</span>
                            </div>
                          </div>
                          
                          {expandedTrunks[`${selectedSupervisor.name}-${trunk.name}`] && (
                            <div className="p-3 border-t">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Array.from({ length: trunk.devices }).map((_, deviceIndex) => {
                                  // Generate realistic device names based on trunk and location
                                  let deviceName;
                                  if (trunk.name.includes('MstpTrunk1')) {
                                    if (selectedSupervisor.name.includes('School')) {
                                      deviceName = `RTU${deviceIndex + 1}`;
                                    } else if (selectedSupervisor.name.includes('Stadium')) {
                                      deviceName = `AHU${deviceIndex + 1}`;
                                    } else {
                                      deviceName = `VAV${deviceIndex + 1}`;
                                    }
                                  } else {
                                    if (selectedSupervisor.name.includes('School')) {
                                      deviceName = `UV_RM${100 + deviceIndex}`;
                                    } else if (selectedSupervisor.name.includes('Stadium')) {
                                      deviceName = `FCU${deviceIndex + 1}`;
                                    } else {
                                      deviceName = `TERM${deviceIndex + 1}`;
                                    }
                                  }
                                  
                                  // Calculate points for this device (distribute evenly among devices)
                                  const pointCount = Math.floor(trunk.points / trunk.devices);
                                  
                                  return (
                                    <div key={deviceIndex} className="border rounded p-2">
                                      <div 
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => toggleDeviceExpansion(`${selectedSupervisor.name}-${trunk.name}-${deviceName}`)}
                                      >
                                        <div className="flex items-center">
                                          {expandedDevices[`${selectedSupervisor.name}-${trunk.name}-${deviceName}`] ? 
                                            <ChevronDown className="h-3 w-3 mr-1" /> : 
                                            <ChevronRight className="h-3 w-3 mr-1" />
                                          }
                                          <span className="font-medium text-sm">{deviceName}</span>
                                        </div>
                                        <span className="text-xs text-gray-600">{pointCount} Points</span>
                                      </div>
                                      
                                      {expandedDevices[`${selectedSupervisor.name}-${trunk.name}-${deviceName}`] && (
                                        <div className="mt-2 text-xs text-gray-600 pl-4">
                                          <ul className="mt-1 list-disc pl-4">
                                            <li>Communication points: {Math.floor(pointCount * 0.15)}</li>
                                            <li>Temperature sensors: {Math.floor(pointCount * 0.25)}</li>
                                            <li>Pressure sensors: {Math.floor(pointCount * 0.1)}</li>
                                            <li>Valve actuators: {Math.floor(pointCount * 0.15)}</li>
                                            <li>Damper controls: {Math.floor(pointCount * 0.2)}</li>
                                            <li>Status/Alarm points: {Math.floor(pointCount * 0.15)}</li>
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    <p>No device data available for this JACE.</p>
                    <p className="mt-2 text-sm">Select another JACE from the JACE Information tab.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InventorySummary;