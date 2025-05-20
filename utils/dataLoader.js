import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

/**
 * Loads supervisor data from the CSV file
 * @returns {Promise<Array>} Array of supervisor objects
 */
export const loadSupervisors = async () => {
  try {
    const filePath = path.join(process.cwd(), 'Site_Info', 'superviosrs.csv');
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    
    const { data } = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      delimitersToGuess: [',', '\t', '|', ';']
    });
    
    // Map CSV data to supervisor objects
    return data.map(item => ({
      name: item.Name,
      address: item.Address,
      hostModel: item['Host Model'],
      version: item.Version,
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
    }));
  } catch (error) {
    console.error('Error loading supervisors:', error);
    return [];
  }
};

/**
 * Loads device data for a specific JACE/school from its CSV file
 * @param {string} jaceName - Name of the JACE/school
 * @returns {Promise<Object>} Object containing device information
 */
export const loadDeviceData = async (jaceName) => {
  try {
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
    
    const filePath = path.join(process.cwd(), 'Site_Info', `${fileName}.csv`);
    
    // Check if file exists
    try {
      await fs.promises.access(filePath);
    } catch (e) {
      console.warn(`No data file found for ${jaceName} (tried ${fileName}.csv)`);
      return {
        stationName: jaceName,
        devices: 0,
        points: 0,
        trunks: []
      };
    }
    
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    
    const { data } = Papa.parse(fileContent, {
      skipEmptyLines: true,
      dynamicTyping: true,
      delimitersToGuess: [',', '\t', '|', ';']
    });
    
    // Extract station name from first row
    const stationNameRow = data[0][0];
    const stationName = stationNameRow.split(',')[1].trim();
    
    // Process the data to extract device information
    const devices = new Set();
    const points = new Set();
    const trunkMap = new Map();
    
    // Start from row 2 (index 1) to skip header
    for (let i = 1; i < data.length; i++) {
      const row = data[i][0].split(',');
      if (row.length >= 4) {
        const type = row[0].trim();
        const network = row[1].trim();
        const trunk = row[2].trim();
        const device = row[3].trim();
        
        if (type === 'Device') {
          devices.add(device);
          
          // Add trunk if not exists
          if (!trunkMap.has(trunk)) {
            trunkMap.set(trunk, {
              name: trunk,
              devices: 0,
              points: 0
            });
          }
          trunkMap.get(trunk).devices++;
        } else if (type === 'Point') {
          points.add(row.join('_')); // Use full row as unique ID for point
          
          // Update points in trunk
          if (trunkMap.has(trunk)) {
            trunkMap.get(trunk).points++;
          }
        }
      }
    }
    
    return {
      stationName,
      devices: devices.size,
      points: points.size,
      trunks: Array.from(trunkMap.values())
    };
  } catch (error) {
    console.error(`Error loading device data for ${jaceName}:`, error);
    return {
      stationName: jaceName,
      devices: 0,
      points: 0,
      trunks: []
    };
  }
};

/**
 * Loads all device data for all supervisors
 * @param {Array} supervisors - Array of supervisor objects
 * @returns {Promise<Object>} Map of supervisor name to device data
 */
export const loadAllDeviceData = async (supervisors) => {
  const deviceData = {};
  
  await Promise.all(
    supervisors.map(async (supervisor) => {
      deviceData[supervisor.name] = await loadDeviceData(supervisor.name);
    })
  );
  
  return deviceData;
};
