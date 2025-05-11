/**
 * This script generates placeholder files for testing the application
 * It creates a local directory structure that mirrors what should be uploaded to S3
 */

const fs = require('fs');
const path = require('path');
const { SERVICE_REPORTS, SCHOOL_IMAGES, DOCUMENTATION } = require('../utils/linkConfig');

// Base directory for placeholder files
const PLACEHOLDER_DIR = path.join(__dirname, '..', 'placeholders');

// Create main directories
const directories = [
  path.join(PLACEHOLDER_DIR, 'ame-report-images'),
  path.join(PLACEHOLDER_DIR, 'service-reports'),
  path.join(PLACEHOLDER_DIR, 'documentation')
];

// Create directories
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create placeholder text file with metadata
function createPlaceholderFile(filePath, metadata) {
  const content = `This is a placeholder file for: ${filePath}\n\n${JSON.stringify(metadata, null, 2)}`;
  
  // Extract the file name from the path
  const fileName = filePath.split('/').pop();
  
  // Determine the directory based on file extension
  let targetDir;
  if (fileName.endsWith('.png') || fileName.endsWith('.ico')) {
    targetDir = path.join(PLACEHOLDER_DIR, 'ame-report-images');
  } else if (fileName.endsWith('.pdf') && fileName.includes('-')) {
    targetDir = path.join(PLACEHOLDER_DIR, 'service-reports');
  } else {
    targetDir = path.join(PLACEHOLDER_DIR, 'documentation');
  }
  
  // Create the placeholder file
  const placeholderPath = path.join(targetDir, fileName);
  fs.writeFileSync(placeholderPath, content);
  console.log(`Created placeholder: ${placeholderPath}`);
}

// Create school image placeholders
Object.entries(SCHOOL_IMAGES).forEach(([schoolName, imagePath]) => {
  const fileName = imagePath.split('/').pop();
  createPlaceholderFile(imagePath, { type: 'School Image', name: schoolName });
});

// Create service report placeholders
Object.entries(SERVICE_REPORTS).forEach(([jobNo, reportPath]) => {
  const fileName = reportPath.split('/').pop();
  createPlaceholderFile(reportPath, { type: 'Service Report', jobNo });
});

// Create documentation placeholders
Object.entries(DOCUMENTATION).forEach(([docType, docPath]) => {
  const fileName = docPath.split('/').pop();
  createPlaceholderFile(docPath, { type: 'Documentation', docType });
});

console.log('\nPlaceholder generation complete!');
console.log(`All files have been created in: ${PLACEHOLDER_DIR}`);
console.log('\nTo use these files for testing:');
console.log('1. Upload the contents of each subfolder to the corresponding S3 bucket directory');
console.log('2. Ensure the BASE_URLS in linkConfig.js point to your actual S3 bucket paths');
