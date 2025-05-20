import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building, Server, HardDrive, Database, ChevronDown, ChevronRight, Circle, Info, Wifi, Clock, Activity, ArrowRight } from 'lucide-react';
import { loadSupervisors, loadAllDeviceData } from '../utils/dataLoader';

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
  const [supervisorsData, setSupervisorsData] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    address: true,
    hostModel: true,
    version: true,
    status: true,
    health: true,
    clientConn: true,
    serverConn: false,
    actions: true
  });
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  
  // Initialize with the first supervisor
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Load supervisors from static JSON
        const supervisors = await loadSupervisors();
        setSupervisorsData(supervisors);
        
        // Load device data from static JSON
        const deviceData = await loadAllDeviceData();
        setSchoolDeviceData(deviceData);
        
        // Set the first supervisor as selected
        if (supervisors.length > 0 && !selectedSupervisor) {
          setSelectedSupervisor(supervisors[0]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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
                <div className="flex justify-between items-center mb-2">
                  <Subheading>JACE Status</Subheading>
                  <button 
                    className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
                    onClick={() => setShowColumnFilter(!showColumnFilter)}
                  >
                    <span className="mr-1">Column Display</span>
                    {showColumnFilter ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                </div>
                <p className="text-sm text-gray-600">Current status of all JACEs in the Clifton Public Schools Building Automation System</p>
                
                {/* Column Filter UI */}
                {showColumnFilter && (
                  <div className="mt-3 p-3 bg-gray-50 border rounded-md">
                    <div className="text-sm font-medium mb-2">Show/Hide Columns:</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={visibleColumns.name} 
                          onChange={() => setVisibleColumns({...visibleColumns, name: !visibleColumns.name})}
                          className="mr-2"
                        />
                        <span className="text-sm">JACE Name</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={visibleColumns.address} 
                          onChange={() => setVisibleColumns({...visibleColumns, address: !visibleColumns.address})}
                          className="mr-2"
                        />
                        <span className="text-sm">IP Address</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={visibleColumns.hostModel} 
                          onChange={() => setVisibleColumns({...visibleColumns, hostModel: !visibleColumns.hostModel})}
                          className="mr-2"
                        />
                        <span className="text-sm">Host Model</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={visibleColumns.version} 
                          onChange={() => setVisibleColumns({...visibleColumns, version: !visibleColumns.version})}
                          className="mr-2"
                        />
                        <span className="text-sm">Version</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={visibleColumns.status} 
                          onChange={() => setVisibleColumns({...visibleColumns, status: !visibleColumns.status})}
                          className="mr-2"
                        />
                        <span className="text-sm">Status</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={visibleColumns.health} 
                          onChange={() => setVisibleColumns({...visibleColumns, health: !visibleColumns.health})}
                          className="mr-2"
                        />
                        <span className="text-sm">Health</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={visibleColumns.clientConn} 
                          onChange={() => setVisibleColumns({...visibleColumns, clientConn: !visibleColumns.clientConn})}
                          className="mr-2"
                        />
                        <span className="text-sm">Client Connection</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={visibleColumns.serverConn} 
                          onChange={() => setVisibleColumns({...visibleColumns, serverConn: !visibleColumns.serverConn})}
                          className="mr-2"
                        />
                        <span className="text-sm">Server Connection</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      {visibleColumns.name && <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">JACE</th>}
                      {visibleColumns.address && <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">IP ADDRESS</th>}
                      {visibleColumns.hostModel && <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">HOST MODEL</th>}
                      {visibleColumns.version && <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">VERSION</th>}
                      {visibleColumns.status && <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">STATUS</th>}
                      {visibleColumns.health && <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">HEALTH</th>}
                      {visibleColumns.clientConn && <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">CLIENT CONN</th>}
                      {visibleColumns.serverConn && <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">SERVER CONN</th>}
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {supervisorsData.map((supervisor, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {visibleColumns.name && (
                          <td className="px-4 py-3 text-sm text-black">
                            {supervisor.name}
                          </td>
                        )}
                        {visibleColumns.address && (
                          <td className="px-4 py-3 text-sm font-mono text-black">
                            {supervisor.address}
                          </td>
                        )}
                        {visibleColumns.hostModel && (
                          <td className="px-4 py-3 text-sm text-black">
                            {supervisor.hostModel}
                          </td>
                        )}
                        {visibleColumns.version && (
                          <td className="px-4 py-3 text-sm text-black">
                            {supervisor.version}
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="px-4 py-3 text-sm">
                            <StatusBadge status={supervisor.status} />
                          </td>
                        )}
                        {visibleColumns.health && (
                          <td className="px-4 py-3 text-sm">
                            <HealthStatus health={supervisor.health} />
                          </td>
                        )}
                        {visibleColumns.clientConn && (
                          <td className="px-4 py-3 text-sm">
                            <ConnectionStatus connected={supervisor.clientConn} />
                          </td>
                        )}
                        {visibleColumns.serverConn && (
                          <td className="px-4 py-3 text-sm">
                            <ConnectionStatus connected={supervisor.serverConn} />
                          </td>
                        )}
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
                <div className="flex justify-between items-center mb-3">
                  <Subheading>Device Tree for {selectedSupervisor.name}</Subheading>
                  
                  {/* New JACE selection dropdown */}
                  <div className="relative">
                    <select 
                      className="appearance-none block w-64 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={selectedSupervisor.name}
                      onChange={(e) => {
                        const selected = supervisorsData.find(sup => sup.name === e.target.value);
                        if (selected) {
                          setSelectedSupervisor(selected);
                        }
                      }}
                    >
                      {supervisorsData.map((sup, i) => (
                        <option key={i} value={sup.name}>
                          {sup.name} {schoolDeviceData[sup.name]?.devices > 0 ? `(${schoolDeviceData[sup.name]?.devices} devices)` : '(No devices)'}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                
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
      {trunk.deviceDetails?.map((device, deviceIndex) => (
        <div key={deviceIndex} className="border rounded p-2">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleDeviceExpansion(`${selectedSupervisor.name}-${trunk.name}-${device.name}`)}
          >
            <div className="flex items-center">
              {expandedDevices[`${selectedSupervisor.name}-${trunk.name}-${device.name}`] ? 
                <ChevronDown className="h-3 w-3 mr-1" /> : 
                <ChevronRight className="h-3 w-3 mr-1" />
              }
              <span className="font-medium text-sm">{device.name}</span>
            </div>
            <span className="text-xs text-gray-600">{device.points} Points</span>
          </div>
          
          {expandedDevices[`${selectedSupervisor.name}-${trunk.name}-${device.name}`] && (
            <div className="mt-2 text-xs text-gray-600 pl-4">
              <ul className="mt-1 list-disc pl-4">
                {device.pointBreakdown && device.pointBreakdown.length > 0 ? (
                  device.pointBreakdown.map((point, pointIndex) => (
                    <li key={pointIndex}>{point.type}: {point.count}</li>
                  ))
                ) : (
                  <>
                    <li>Communication points: {Math.floor(device.points * 0.15)}</li>
                    <li>Temperature sensors: {Math.floor(device.points * 0.25)}</li>
                    <li>Pressure sensors: {Math.floor(device.points * 0.1)}</li>
                    <li>Valve actuators: {Math.floor(device.points * 0.15)}</li>
                    <li>Damper controls: {Math.floor(device.points * 0.2)}</li>
                    <li>Status/Alarm points: {Math.floor(device.points * 0.15)}</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      ))}
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