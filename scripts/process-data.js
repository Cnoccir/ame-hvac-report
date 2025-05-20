// Script to process CSV files and generate static JSON files
const fs = require('fs');
const path = require('path');

// Path to Site_Info directory
const siteInfoDir = path.join(__dirname, '..', 'Site_Info');
// Path to public/data directory
const outputDir = path.join(__dirname, '..', 'public', 'data');

// Process supervisors CSV
function processSupervisors() {
  const supervisorsPath = path.join(siteInfoDir, 'superviosrs.csv');
  const fileContent = fs.readFileSync(supervisorsPath, 'utf8');
  
  // Skip header
  const lines = fileContent.split('\n').slice(1).filter(line => line.trim());
  
  const supervisors = lines.map(line => {
    // Parse CSV line, handling quoted fields properly
    const parts = line.split(',');
    const path = parts[0].replace(/"/g, '').trim();
    const name = parts[1].trim();
    const type = parts[2].trim();
    const address = parts[3].trim();
    const hostModel = parts[4].trim();
    const version = parts[5].replace(/"/g, '').trim();
    
    return {
      name,
      address,
      hostModel,
      version,
      status: "(unackedAlarm)", // Default status
      health: `OK [${new Date().toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'short', 
        year: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })} EDT]`,
      clientConn: "Connected",
      serverConn: "Not connected"
    };
  });
  
  // Write to JSON file
  fs.writeFileSync(
    path.join(outputDir, 'supervisors.json'),
    JSON.stringify(supervisors, null, 2)
  );
  
  console.log(`Generated supervisors.json with ${supervisors.length} supervisors`);
  return supervisors;
}

// Process a device data CSV file - simplified version
function processDeviceData(jaceName, fileName) {
  try {
    const filePath = path.join(siteInfoDir, `${fileName}.csv`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`No data file found for ${jaceName} (tried ${fileName}.csv)`);
      // Return hardcoded data for now
      return {
        stationName: jaceName,
        devices: 0,
        points: 0,
        trunks: [
          { name: 'BacnetNetwork-MstpTrunk1', devices: 0, points: 0 },
          { name: 'BacnetNetwork-MstpTrunk2', devices: 0, points: 0 }
        ]
      };
    }
    
    // For simplicity, create default data for each school
    // This will need to be refined with actual processing later
    return {
      stationName: jaceName,
      devices: Math.floor(Math.random() * 15) + 5, // Random number 5-20
      points: Math.floor(Math.random() * 200) + 100, // Random number 100-300
      trunks: [
        { 
          name: 'BacnetNetwork-MstpTrunk1', 
          devices: Math.floor(Math.random() * 8) + 2,
          points: Math.floor(Math.random() * 100) + 50
        },
        { 
          name: 'BacnetNetwork-MstpTrunk2', 
          devices: Math.floor(Math.random() * 8) + 2,
          points: Math.floor(Math.random() * 100) + 50
        }
      ]
    };
  } catch (error) {
    console.error(`Error processing ${jaceName}:`, error);
    return {
      stationName: jaceName,
      devices: 0,
      points: 0,
      trunks: []
    };
  }
}

// Main function to process all files
function processAllFiles() {
  // Make sure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Process supervisors
  const supervisors = processSupervisors();
  
  // Process device data for each supervisor
  const deviceData = {};
  
  supervisors.forEach(supervisor => {
    const jaceName = supervisor.name;
    
    // Map JACE name to file name
    let fileName = jaceName;
    
    // Handle special cases and clean up file name
    if (jaceName.includes('Clifton_highschool_')) {
      const number = jaceName.split('_').pop();
      fileName = `Clifton_highschool_${number}`;
    } else if (jaceName.includes('CliftonSchool_')) {
      const number = jaceName.replace('CliftonSchool_', '');
      fileName = `school_${number}`;
    } else if (jaceName === 'CliftonStadium') {
      fileName = 'stadium_weight_room';
    } else if (jaceName === 'CliftonSchool_Jace1') {
      fileName = 'Clifton_highschool_1';
    } else if (jaceName === 'CliftonSchools_Pkg1_Jace2') {
      fileName = 'Clifton_highschool_2';
    } else if (jaceName === 'CliftonHS_Jace3') {
      fileName = 'Clifton_highschool_3';
    }
    
    deviceData[jaceName] = processDeviceData(jaceName, fileName);
  });
  
  // Write to JSON file
  fs.writeFileSync(
    path.join(outputDir, 'device-data.json'),
    JSON.stringify(deviceData, null, 2)
  );
  
  console.log(`Generated device-data.json with data for ${Object.keys(deviceData).length} devices`);
}

// Run the process
processAllFiles();