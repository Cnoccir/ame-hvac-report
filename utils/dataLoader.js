/**
 * Loads supervisor data from the static JSON file
 * @returns {Promise<Array>} Array of supervisor objects
 */
export const loadSupervisors = async () => {
  try {
    const response = await fetch('/data/supervisors.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load supervisors: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading supervisors:', error);
    return [];
  }
};

/**
 * Loads all device data for all supervisors from the static JSON file
 * @returns {Promise<Object>} Map of supervisor name to device data
 */
export const loadAllDeviceData = async () => {
  try {
    const response = await fetch('/data/device-data.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load device data: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading device data:', error);
    return {};
  }
};

/**
 * Loads device data for a specific JACE/school
 * @param {string} jaceName - Name of the JACE/school
 * @returns {Promise<Object>} Object containing device information
 */
export const loadDeviceData = async (jaceName) => {
  try {
    const allDeviceData = await loadAllDeviceData();
    
    if (allDeviceData[jaceName]) {
      return allDeviceData[jaceName];
    } else {
      console.warn(`No data found for JACE: ${jaceName}`);
      return {
        stationName: jaceName,
        devices: 0,
        points: 0,
        trunks: []
      };
    }
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