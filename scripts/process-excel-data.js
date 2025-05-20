// Script to process Excel files and generate static JSON files
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Path to the Excel files
const excelFilesDir = path.join('C:', 'Users', 'tech', 'Projects', 'tridium_exports', 'output_data');
// Path to output JSON files
const outputDir = path.join(__dirname, '..', 'public', 'data');

// Make sure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to process a single Excel file
function processExcelFile(filePath, schoolName) {
  console.log(`Processing file: ${filePath}`);
  
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    
    // Get the first sheet which should have the summary
    const firstSheetName = workbook.SheetNames[0];
    const summarySheet = workbook.Sheets[firstSheetName];
    
    // Convert sheet to JSON
    const summaryData = xlsx.utils.sheet_to_json(summarySheet);
    
    console.log(`Summary data for ${schoolName}:`, JSON.stringify(summaryData.slice(0, 2), null, 2));
    
    // Extract trunk information
    const trunks = [];
    let currentTrunk = null;
    
    // Process all sheets in the workbook
    workbook.SheetNames.forEach(sheetName => {
      console.log(`Processing sheet: ${sheetName}`);
      
      // Skip the first sheet if it's just a summary
      if (sheetName === firstSheetName && sheetName.toLowerCase().includes('summary')) {
        return;
      }
      
      const sheet = workbook.Sheets[sheetName];
      const sheetData = xlsx.utils.sheet_to_json(sheet);
      
      // Check if this sheet represents a trunk
      if (sheetName.includes('MstpTrunk') || sheetName.includes('Trunk')) {
        // This is a trunk sheet
        currentTrunk = {
          name: sheetName,
          devices: 0,
          points: 0,
          deviceDetails: []
        };
        trunks.push(currentTrunk);
        
        // Process device data from this trunk sheet
        let deviceCount = 0;
        let pointCount = 0;
        
        // Count devices and points
        sheetData.forEach(row => {
          // This would need to be adjusted based on actual Excel structure
          if (row.Type === 'Device') {
            deviceCount++;
            currentTrunk.deviceDetails.push({
              name: row.Name || `Device_${deviceCount}`,
              points: 0,
              pointBreakdown: []
            });
          } else if (row.Type === 'Point') {
            pointCount++;
            // Add point to the last device
            if (currentTrunk.deviceDetails.length > 0) {
              const lastDevice = currentTrunk.deviceDetails[currentTrunk.deviceDetails.length - 1];
              lastDevice.points++;
              
              // Group points by type
              const pointType = row.PointType || 'Other';
              let pointBreakdownItem = lastDevice.pointBreakdown.find(p => p.type === pointType);
              
              if (!pointBreakdownItem) {
                pointBreakdownItem = { type: pointType, count: 0 };
                lastDevice.pointBreakdown.push(pointBreakdownItem);
              }
              
              pointBreakdownItem.count++;
            }
          }
        });
        
        currentTrunk.devices = deviceCount;
        currentTrunk.points = pointCount;
      } else if (sheetName.includes('RTU') || sheetName.includes('VAV') || sheetName.includes('AHU') || sheetName.includes('UV_RM')) {
        // This is a device detail sheet
        // Find which trunk this device belongs to
        if (trunks.length === 0) {
          // If no trunks yet, create a default one
          currentTrunk = {
            name: 'Default-Trunk',
            devices: 0,
            points: 0,
            deviceDetails: []
          };
          trunks.push(currentTrunk);
        }
        
        // Create a device from this sheet
        const device = {
          name: sheetName,
          points: sheetData.length,
          pointBreakdown: []
        };
        
        currentTrunk.deviceDetails.push(device);
        currentTrunk.devices++;
        currentTrunk.points += device.points;
        
        // Group points by type
        const pointTypes = {};
        
        sheetData.forEach(row => {
          const pointType = row.PointType || 'Other';
          if (!pointTypes[pointType]) {
            pointTypes[pointType] = 0;
          }
          pointTypes[pointType]++;
        });
        
        // Convert point types to array
        for (const [type, count] of Object.entries(pointTypes)) {
          device.pointBreakdown.push({ type, count });
        }
      }
    });
    
    // Calculate total devices and points
    const totalDevices = trunks.reduce((sum, trunk) => sum + trunk.devices, 0);
    const totalPoints = trunks.reduce((sum, trunk) => sum + trunk.points, 0);
    
    return {
      stationName: schoolName,
      devices: totalDevices,
      points: totalPoints,
      trunks
    };
  } catch (error) {
    console.error(`Error processing Excel file ${filePath}:`, error);
    return {
      stationName: schoolName,
      devices: 0,
      points: 0,
      trunks: []
    };
  }
}

// Function to process all Excel files and generate JSON
function processAllExcelFiles() {
  // Get list of all Excel files
  const files = fs.readdirSync(excelFilesDir).filter(file => 
    file.endsWith('.xlsx') && file.includes('Device_Report')
  );
  
  const deviceData = {};
  
  files.forEach(file => {
    const filePath = path.join(excelFilesDir, file);
    
    // Extract school name from filename
    let schoolName = file.replace('_Device_Report.xlsx', '');
    
    // Convert to the format used in supervisors data
    if (schoolName.startsWith('school_')) {
      schoolName = 'CliftonSchool_' + schoolName.replace('school_', '');
    } else if (schoolName === 'stadium_weight_room') {
      schoolName = 'CliftonStadium';
    } else if (schoolName.startsWith('Clifton_highschool_')) {
      const number = schoolName.split('_').pop();
      if (number === '1') {
        schoolName = 'CliftonSchool_Jace1';
      } else if (number === '2') {
        schoolName = 'CliftonSchools_Pkg1_Jace2';
      } else if (number === '3') {
        schoolName = 'CliftonHS_Jace3';
      }
    }
    
    deviceData[schoolName] = processExcelFile(filePath, schoolName);
  });
  
  // Write to JSON file
  fs.writeFileSync(
    path.join(outputDir, 'device-data.json'),
    JSON.stringify(deviceData, null, 2)
  );
  
  console.log(`Generated device-data.json with data for ${Object.keys(deviceData).length} devices`);
  
  return deviceData;
}

// Process supervisor data
function processSupervisors() {
  // Updated supervisor data based on provided table
  const supervisors = [
    {
      name: "Clifton_BOE",
      address: "10.10.10.98",
      hostModel: "TITAN",
      version: "4.13.2.18", 
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_1",
      address: "10.10.10.65",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_2",
      address: "10.10.10.66",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_3",
      address: "10.10.10.67",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_4",
      address: "10.10.10.68",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_9",
      address: "10.10.10.71",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_10",
      address: "10.10.10.72",
      hostModel: "TITAN",
      version: "4.13.2.18", 
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_11",
      address: "10.10.10.73",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_12",
      address: "10.10.10.74",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_13",
      address: "10.10.10.75",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_14",
      address: "10.10.10.76",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_15",
      address: "10.10.10.77",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "Woodrow_Wilson_FieldHouse",
      address: "10.10.10.103",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_Jace1",
      address: "10.10.10.104",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchool_5",
      address: "10.10.10.105",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonSchools_Pkg1_Jace2",
      address: "10.10.10.106",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonHighSchoolHWS",
      address: "10.10.13.45",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "Clifton_School_1",
      address: "10.10.13.65",
      hostModel: "nuxbc",
      version: "4.13.2.18",
      status: "down",
      health: "Fail [19-May-25 7:36 AM EDT]",
      clientConn: "Not connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: "Mismatched station names: Clifton_School_1 != CliftonSchool_1"
    },
    {
      name: "CliftonStadium",
      address: "10.10.13.66",
      hostModel: "nuxbc",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "CliftonHS_Jace3",
      address: "10.10.13.67",
      hostModel: "nuxbc",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "Sch12_HWS",
      address: "10.10.20.73",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "Clifton_CCWS",
      address: "10.10.20.74",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "Clifton_WWMS",
      address: "10.10.20.75",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{unackedAlarm}",
      health: "Ok [19-May-25 7:36 AM EDT]",
      clientConn: "Connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: ""
    },
    {
      name: "Clifton_Supervisor",
      address: "ip:DESKTOP-1V9GAUP",
      hostModel: "TITAN",
      version: "4.13.2.18",
      status: "{disabled, fault}",
      health: "Fail [null]",
      clientConn: "Not connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: "This is the supervisor instance"
    },
    {
      name: "CliftonSchool_8",
      address: "ip:",
      hostModel: "-",
      version: "-",
      status: "{disabled}",
      health: "Fail [null]",
      clientConn: "Not connected",
      serverConn: "Not connected",
      virtualsEnabled: false,
      notes: "Possibly unconfigured or removed"
    }
  ];
  
  // Write to JSON file
  fs.writeFileSync(
    path.join(outputDir, 'supervisors.json'),
    JSON.stringify(supervisors, null, 2)
  );
  
  console.log(`Generated supervisors.json with ${supervisors.length} supervisors`);
  
  return supervisors;
}

// Run processing functions
function main() {
  processSupervisors();
  processAllExcelFiles();
}

main();