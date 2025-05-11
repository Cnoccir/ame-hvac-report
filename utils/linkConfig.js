/**
 * AME Inc. Link Configuration
 * This file centralizes all external links and file paths used in the application
 */

// Base URLs for different asset types
const BASE_URLS = {
  IMAGES: 'https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images',
  REPORTS: 'https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/service-reports',
  DOCS: 'https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/documentation'
};

// School images mapping
const SCHOOL_IMAGES = {
  "Clifton High School": `${BASE_URLS.IMAGES}/CliftonHS.png`,
  "Clifton Stadium Weight Room": `${BASE_URLS.IMAGES}/Clifton+Stadium+Weight+Room.png`,
  "Clifton Public School #1": `${BASE_URLS.IMAGES}/CliftonPS1.png`,
  "Clifton Public School #3": `${BASE_URLS.IMAGES}/CliftonPS3.png`,
  "Clifton Public School #4": `${BASE_URLS.IMAGES}/CliftonPS4.png`,
  "Clifton Public School #5": `${BASE_URLS.IMAGES}/CliftonPS5.png`,
  "Clifton Public School #9": `${BASE_URLS.IMAGES}/CliftonPS9.png`,
  "Clifton Public School #11": `${BASE_URLS.IMAGES}/CliftonPS11.png`,
  "Clifton Public School #14": `${BASE_URLS.IMAGES}/CliftonPS14.png`,
  "Clifton School #17": `${BASE_URLS.IMAGES}/CliftonPS17.png`,
  "Clifton Early Learner Academy": `${BASE_URLS.IMAGES}/CliftonELA.png`
};

// Service report PDFs mapping by job number
const SERVICE_REPORTS = {
  // Clifton School #17 Reports
  "211664-13788": `${BASE_URLS.REPORTS}/211664-13788-PS17.pdf`,
  
  // Clifton Early Learner Academy Reports
  "210965-12939": `${BASE_URLS.REPORTS}/210965-12939-ELA.pdf`,
  "210972-12946": `${BASE_URLS.REPORTS}/210972-12946-ELA.pdf`,
  
  // Clifton High School Reports
  "210966-12940": `${BASE_URLS.REPORTS}/210966-12940-CHS.pdf`,
  "210955-12929": `${BASE_URLS.REPORTS}/210955-12929-CHS.pdf`,
  "210973-12947": `${BASE_URLS.REPORTS}/210973-12947-CHS.pdf`,
  
  // Clifton Stadium Weight Room Reports
  "210956-12930": `${BASE_URLS.REPORTS}/210956-12930-CSWR.pdf`,
  "210967-12941": `${BASE_URLS.REPORTS}/210967-12941-CSWR.pdf`,
  
  // Clifton Public School #1 Reports
  "210960-12934": `${BASE_URLS.REPORTS}/210960-12934-PS1.pdf`,
  "210978-12952": `${BASE_URLS.REPORTS}/210978-12952-PS1.pdf`,
  
  // Clifton Public School #3 Reports
  "210964-12938": `${BASE_URLS.REPORTS}/210964-12938-PS3.pdf`,
  "210993-12967": `${BASE_URLS.REPORTS}/210993-12967-PS3.pdf`,
  
  // Clifton Public School #4 Reports
  "210958-12932": `${BASE_URLS.REPORTS}/210958-12932-PS4.pdf`,
  "210976-12950": `${BASE_URLS.REPORTS}/210976-12950-PS4.pdf`,
  
  // Clifton Public School #5 Reports
  "210959-12933": `${BASE_URLS.REPORTS}/210959-12933-PS5.pdf`,
  "210977-12951": `${BASE_URLS.REPORTS}/210977-12951-PS5.pdf`,
  "210996-12970": `${BASE_URLS.REPORTS}/210996-12970-PS5.pdf`,
  
  // Clifton Public School #9 Reports
  "210961-12935": `${BASE_URLS.REPORTS}/210961-12935-PS9.pdf`,
  "210979-12953": `${BASE_URLS.REPORTS}/210979-12953-PS9.pdf`,
  
  // Clifton Public School #11 Reports
  "210957-12931": `${BASE_URLS.REPORTS}/210957-12931-PS11.pdf`,
  "210968-12942": `${BASE_URLS.REPORTS}/210968-12942-PS11.pdf`,
  "210975-12949": `${BASE_URLS.REPORTS}/210975-12949-PS11.pdf`,
  
  // Clifton Public School #14 Reports
  "210962-12936": `${BASE_URLS.REPORTS}/210962-12936-PS14.pdf`,
  "210969-12943": `${BASE_URLS.REPORTS}/210969-12943-PS14.pdf`,
  "210991-12965": `${BASE_URLS.REPORTS}/210991-12965-PS14.pdf`
};

// Other document links
const DOCUMENTATION = {
  AME_LOGO: `${BASE_URLS.IMAGES}/ame-logo.png`,
  FAVICON: `${BASE_URLS.IMAGES}/favicon.ico`,
  SYSTEM_MANUAL: `${BASE_URLS.DOCS}/ame-system-manual.pdf`,
  MAINTENANCE_GUIDE: `${BASE_URLS.DOCS}/ame-maintenance-guide.pdf`
};

// Export all configurations
export { 
  BASE_URLS,
  SCHOOL_IMAGES,
  SERVICE_REPORTS,
  DOCUMENTATION
};
