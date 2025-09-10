/*
 * Server-safe data loader for the print/PDF export.
 * Aggregates report data from existing in-repo sources into a single object.
 *
 * NOTE: Implemented in JavaScript to match the current codebase (no TypeScript).
 */

import fs from 'fs/promises';
import path from 'path';
import { SCHOOL_IMAGES } from './linkConfig';

// -----------------------------
// Local data (replicated from pages/index.js and components)
// -----------------------------

// School data with coordinates and summary metrics
const schoolData = [
  {
    id: 1,
    name: "Clifton High School",
    address: "333 Colfax Avenue",
    visits: 4,
    hours: 37.5,
    lat: 40.868,
    lng: -74.164,
    technicians: ["Rupert Chandool", "Richard Bhajan", "Mike V."],
    imageUrl: SCHOOL_IMAGES["Clifton High School"],
    label: 'HS'
  },
  {
    id: 2,
    name: "Clifton Stadium Weight Room",
    address: "350 Piaget Avenue",
    visits: 4,
    hours: 20.5,
    lat: 40.875,
    lng: -74.163,
    technicians: ["Rupert Chandool", "Threshan Ramsarran", "Mike V."],
    imageUrl: SCHOOL_IMAGES["Clifton Stadium Weight Room"],
    label: 'WR'
  },
  {
    id: 3,
    name: "Clifton Public School #1",
    address: "158 Park Slope",
    visits: 3,
    hours: 16,
    lat: 40.879,
    lng: -74.168,
    technicians: ["Rupert Chandool", "Mike V."],
    imageUrl: SCHOOL_IMAGES["Clifton Public School #1"],
    label: '1'
  },
  {
    id: 4,
    name: "Clifton Public School #3",
    address: "365 Washington Avenue",
    visits: 4,
    hours: 16.5,
    lat: 40.876,
    lng: -74.165,
    technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran", "Mike V."],
    imageUrl: SCHOOL_IMAGES["Clifton Public School #3"],
    label: '3'
  },
  {
    id: 5,
    name: "Clifton Public School #4",
    address: "194 West 2nd Street",
    visits: 4,
    hours: 20.5,
    lat: 40.882,
    lng: -74.163,
    technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran", "Richard Bhajan", "Mike V."],
    imageUrl: SCHOOL_IMAGES["Clifton Public School #4"],
    label: '4'
  },
  {
    id: 6,
    name: "Clifton Public School #5",
    address: "136 Valley Road",
    visits: 4,
    hours: 17,
    lat: 40.888,
    lng: -74.167,
    technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran", "Mike V."],
    imageUrl: SCHOOL_IMAGES["Clifton Public School #5"],
    label: '5'
  },
  {
    id: 7,
    name: "Clifton Public School #9",
    address: "25 Brighton Road",
    visits: 3,
    hours: 16,
    lat: 40.857,
    lng: -74.163,
    technicians: ["Rupert Chandool", "Mike V."],
    imageUrl: SCHOOL_IMAGES["Clifton Public School #9"],
    label: '9'
  },
  {
    id: 8,
    name: "Clifton Public School #11",
    address: "147 Merselis Avenue",
    visits: 4,
    hours: 23.5,
    lat: 40.885,
    lng: -74.153,
    technicians: ["Rupert Chandool", "Threshan Ramsarran", "Mike V."],
    imageUrl: SCHOOL_IMAGES["Clifton Public School #11"],
    label: '11'
  },
  {
    id: 9,
    name: "Clifton Public School #14",
    address: "99 Saint Andrews Blvd",
    visits: 4,
    hours: 15,
    lat: 40.865,
    lng: -74.165,
    technicians: ["Rupert Chandool", "Mike V."],
    imageUrl: SCHOOL_IMAGES["Clifton Public School #14"],
    label: '14'
  },
  {
    id: 10,
    name: "Clifton School #17",
    address: "361 Lexington Avenue, Clifton NJ 07011",
    visits: 4,
    hours: 19,
    lat: 40.872,
    lng: -74.159,
    technicians: ["Rupert Chandool", "Richard Bhajan", "Mike V."],
    imageUrl: SCHOOL_IMAGES["Clifton School #17"],
    label: '17'
  },
  {
    id: 11,
    name: "Clifton Early Learner Academy",
    address: "290 Brighton Road, Clifton NJ 07012",
    visits: 7,
    hours: 34.5,
    lat: 40.855,
    lng: -74.167,
    technicians: ["Rupert Chandool", "Richard Bhajan", "Mike V."],
    imageUrl: SCHOOL_IMAGES["Clifton Early Learner Academy"],
    label: 'ELA'
  }
];

// Technician data
const technicianData = [
  { name: "Rupert Chandool", visits: 22, hours: 81 },
  { name: "Richard Bhajan", visits: 7, hours: 29 },
  { name: "Henry Sanchez", visits: 3, hours: 8 },
  { name: "Threshan Ramsarran", visits: 5, hours: 16 },
  { name: "Mike V.", visits: 11, hours: 88 }
];

// Visit timeline data (flattened)
const visitData = [
  { date: "07/24/2024", school: "Clifton Early Learner Academy", tech: "Richard Bhajan", hours: 5.0 },
  { date: "07/24/2024", school: "Clifton School #17", tech: "Richard Bhajan", hours: 3.5 },
  { date: "12/13/2024", school: "Clifton Early Learner Academy", tech: "Richard Bhajan", hours: 3.0 },
  { date: "12/13/2024", school: "Clifton School #17", tech: "Richard Bhajan", hours: 4.0 },
  { date: "02/19/2025", school: "Clifton Early Learner Academy", tech: "Rupert Chandool", hours: 5.5 },
  { date: "03/03/2025", school: "Clifton HS", tech: "Rupert Chandool", hours: 8.0 },
  { date: "03/04/2025", school: "Clifton Stadium Weight Room", tech: "Rupert Chandool, Threshan Ramsarran", hours: 7.0 },
  { date: "03/04/2025", school: "Clifton Public School #11", tech: "Rupert Chandool, Threshan Ramsarran", hours: 9.0 },
  { date: "03/06/2025", school: "Clifton Public School #1", tech: "Rupert Chandool", hours: 4.0 },
  { date: "03/06/2025", school: "Clifton Public School #9", tech: "Rupert Chandool", hours: 4.0 },
  { date: "03/07/2025", school: "Clifton Public School #14", tech: "Rupert Chandool", hours: 3.0 },
  { date: "03/21/2025", school: "Clifton Public School #3", tech: "Henry Sanchez, Threshan Ramsarran", hours: 4.0 },
  { date: "03/21/2025", school: "Clifton Public School #4", tech: "Henry Sanchez, Threshan Ramsarran", hours: 6.5 },
  { date: "03/21/2025", school: "Clifton Public School #5", tech: "Henry Sanchez, Threshan Ramsarran", hours: 5.5 },
  { date: "03/24/2025", school: "Clifton HS", tech: "Richard Bhajan", hours: 5.5 },
  { date: "03/24/2025", school: "Clifton Early Learner Academy", tech: "Rupert Chandool", hours: 4.5 },
  { date: "04/09/2025", school: "Clifton Early Learner Academy", tech: "Rupert Chandool", hours: 4.5 },
  { date: "04/09/2025", school: "Clifton Stadium Weight Room", tech: "Rupert Chandool", hours: 3.5 },
  { date: "04/10/2025", school: "Clifton Public School #11", tech: "Rupert Chandool", hours: 3.0 },
  { date: "04/10/2025", school: "Clifton Public School #14", tech: "Rupert Chandool", hours: 2.0 },
  { date: "04/11/2025", school: "Clifton Public School #3", tech: "Rupert Chandool", hours: 2.5 },
  { date: "04/11/2025", school: "Clifton Public School #4", tech: "Rupert Chandool", hours: 2.0 },
  { date: "04/11/2025", school: "Clifton School #17", tech: "Rupert Chandool", hours: 3.5 },
  { date: "04/21/2025", school: "Clifton Public School #1", tech: "Rupert Chandool", hours: 4.0 },
  { date: "04/21/2025", school: "Clifton Public School #9", tech: "Rupert Chandool", hours: 4.0 },
  { date: "04/23/2025", school: "Clifton Stadium Weight Room", tech: "Rupert Chandool", hours: 2.0 },
  { date: "04/23/2025", school: "Clifton Public School #5", tech: "Rupert Chandool", hours: 2.5 },
  { date: "04/23/2025", school: "Clifton Public School #11", tech: "Rupert Chandool", hours: 3.5 },
  { date: "04/25/2025", school: "Clifton HS", tech: "Rupert Chandool", hours: 8.0 },
  { date: "04/30/2025", school: "Clifton Public School #3", tech: "Rupert Chandool", hours: 2.0 },
  { date: "04/30/2025", school: "Clifton Public School #5", tech: "Rupert Chandool", hours: 1.0 },
  { date: "04/30/2025", school: "Clifton Public School #14", tech: "Rupert Chandool", hours: 2.0 },
  { date: "05/07/2025", school: "Clifton Early Learner Academy", tech: "Richard Bhajan", hours: 4.0 },
  { date: "05/07/2025", school: "Clifton Public School #4", tech: "Richard Bhajan", hours: 4.0 },
  { date: "05/01/2025", school: "Clifton Early Learner Academy", tech: "Mike V.", hours: 8.0, remote: true },
  { date: "05/01/2025", school: "Clifton HS", tech: "Mike V.", hours: 8.0, remote: true },
  { date: "05/02/2025", school: "Clifton Public School #1", tech: "Mike V.", hours: 8.0, remote: true },
  { date: "05/02/2025", school: "Clifton Public School #11", tech: "Mike V.", hours: 8.0, remote: true },
  { date: "05/05/2025", school: "Clifton Public School #14", tech: "Mike V.", hours: 8.0, remote: true },
  { date: "05/05/2025", school: "Clifton School #17", tech: "Mike V.", hours: 8.0, remote: true },
  { date: "05/06/2025", school: "Clifton Public School #3", tech: "Mike V.", hours: 8.0, remote: true },
  { date: "05/06/2025", school: "Clifton Public School #4", tech: "Mike V.", hours: 8.0, remote: true },
  { date: "05/08/2025", school: "Clifton Public School #5", tech: "Mike V.", hours: 8.0, remote: true },
  { date: "05/08/2025", school: "Clifton Public School #9", tech: "Mike V.", hours: 8.0, remote: true },
  { date: "05/09/2025", school: "Clifton Stadium Weight Room", tech: "Mike V.", hours: 8.0, remote: true }
];

// Monthly totals and calendar data
const monthlyHours = [
  { month: "July 2024", hours: 8.5 },
  { month: "December 2024", hours: 7.0 },
  { month: "February 2025", hours: 5.5 },
  { month: "March 2025", hours: 57.0 },
  { month: "April 2025", hours: 48.5 },
  { month: "May 2025", hours: 110.0 }
];

const calendarData = [
  { month: "July 2024", weeks: {
    "Week 1 (7/1-7/7)": 0,
    "Week 2 (7/8-7/14)": 0,
    "Week 3 (7/15-7/21)": 0,
    "Week 4 (7/22-7/28)": 8.5
  }},
  { month: "December 2024", weeks: {
    "Week 1 (12/1-12/7)": 0,
    "Week 2 (12/8-12/14)": 7.0,
    "Week 3 (12/15-12/21)": 0,
    "Week 4 (12/22-12/28)": 0
  }},
  { month: "February 2025", weeks: {
    "Week 1 (2/1-2/7)": 0,
    "Week 2 (2/8-2/14)": 0,
    "Week 3 (2/15-2/21)": 5.5,
    "Week 4 (2/22-2/28)": 0
  }},
  { month: "March 2025", weeks: {
    "Week 1 (3/1-3/7)": 35.0,
    "Week 2 (3/8-3/14)": 0,
    "Week 3 (3/15-3/21)": 16.0,
    "Week 4 (3/22-3/28)": 10.0
  }},
  { month: "April 2025", weeks: {
    "Week 1 (4/1-4/7)": 0,
    "Week 2 (4/8-4/14)": 19.5,
    "Week 3 (4/15-4/21)": 8.0,
    "Week 4 (4/22-4/28)": 16.0,
    "Week 5 (4/29-4/30)": 5.0
  }},
  { month: "May 2025", weeks: {
    "Week 1 (5/1-5/7)": 72.0,
    "Week 2 (5/8-5/14)": 16.0,
    "Week 3 (5/15-5/21)": 0,
    "Week 4 (5/22-5/28)": 0
  }}
];

// Issues from IssueAnalysis (aggregated for print)
const issueSchoolCounts = [
  { school: 'PS #1', count: 4 },
  { school: 'PS #3', count: 3 },
  { school: 'PS #4', count: 3 },
  { school: 'PS #5', count: 3 },
  { school: 'PS #9', count: 4 },
  { school: 'PS #11', count: 6 },
  { school: 'PS #14', count: 3 },
  { school: 'PS #17', count: 3 },
  { school: 'Early Learner Academy', count: 9 },
  { school: 'High School', count: 10 },
  { school: 'Stadium Weight Room', count: 2 },
];

const issueCards = [
  {
    priority: 'High',
    title: 'RTU Communication Failures',
    impact: 'Affects 3 schools (PS #17, PS #3, PS #1)',
    recommendation: 'Schedule immediate mechanical contractor inspection for all affected units.',
    affects: 'Connectivity'
  },
  {
    priority: 'High',
    title: 'Heating Valve Defects',
    impact: 'Affects 4 schools (Early Learner Academy, PS #11, High School, PS #14)',
    recommendation: 'Replace defective Honeywell ML7425A3013 parts and inspect valve bodies for leaks.',
    affects: 'Heating'
  },
  {
    priority: 'Medium',
    title: 'VAV Damper Flow Issues',
    impact: 'Most severe at Early Learner Academy (7 VAVs)',
    recommendation: 'Replace all defective CVL4022AS controllers and associated thermostats.',
    affects: 'Airflow'
  },
  {
    priority: 'High',
    title: 'Fan Failures',
    impact: 'Affects 4 schools (Early Learner Academy, PS #11, High School, PS #4)',
    recommendation: 'Comprehensive mechanical service for bearing replacement and fan alignment.',
    affects: 'Mechanical'
  },
  {
    priority: 'Medium',
    title: 'JACE System Management',
    impact: 'Affects 4 schools (PS #17, PS #11, High School, PS #3)',
    recommendation: 'System-wide control network analysis and firmware updates.',
    affects: 'System'
  },
  {
    priority: 'High',
    title: 'Freeze Stat Problems',
    impact: 'High School (multiple UV units), PS #4 (AC-1 freeze stat set too high).',
    recommendation: 'Inspection and recalibration of all freeze stats.',
    affects: 'Temperature'
  },
  {
    priority: 'Medium',
    title: 'Manual System Overrides',
    impact: 'Affects 7 schools (PS #4, PS #5, PS #9, PS #11, PS #14, PS #1, Stadium Weight Room)',
    recommendation: 'Staff education program and potential control lockouts.',
    affects: 'Operational'
  },
  {
    priority: 'High',
    title: 'Daikin VRV/VRF Integration',
    impact: 'Affects 5 schools (PS #9, PS #11, PS #3, PS #1, PS #14)',
    recommendation: 'Accelerated Daikin integration prior to peak cooling season.',
    affects: 'Integration'
  },
  {
    priority: 'High',
    title: 'Chiller Faults',
    impact: 'Early Learner Academy and High School thermal comfort',
    recommendation: 'Comprehensive mechanical inspection of chiller systems and pumps.',
    affects: 'Mechanical'
  },
];

// Detailed visit logs by school (from pages/index.js)
const visitLogBySchool = {
  "Clifton High School": [
    {
      date: "March 3, 2025",
      technician: "Rupert Chandool",
      duration: "8.00 hours",
      summary: [
        "Comprehensive system check with Bogdan.",
        "Found multiple offline equipment (ERU_A28, ERU_G5, ERU_G16C).",
        "Several units requiring freeze stat resets.",
        "Hot water valve issue with UV_C313_EF (valve remains closed despite discharge temp over 100°F).",
        "Construction team notified to investigate valve issue."
      ]
    },
    {
      date: "March 24, 2025",
      technician: "Richard Bhajan",
      duration: "5.50 hours",
      summary: [
        "Resolved issue with entire 6000 wing by resetting Jace and using bacnet router.",
        "Documented ongoing freeze stat issues that trip at temperatures up to 58°F.",
        "Pictures of affected units sent to Vinny for follow-up as requested by customer."
      ]
    },
    {
      date: "April 25, 2025",
      technician: "Rupert Chandool",
      duration: "8.00 hours",
      summary: [
        "Performed full system check and found multiple freeze alarms on UV units.",
        "Units with freeze alarms: UVN_311, UVN_309b, UVN_218_Ftr, UVS313_EF, UVE205_EF, UVE207_EF, UVE209_EF, UVE211_EF, UVE305_EF.",
        "Notified D&B to schedule Daikin unit inspection for freeze stat issues in spring.",
        "Air balancing team was on-site during inspection, causing all heating valve bodies to be 100% open."
      ]
    },
    {
      date: "May 1, 2025",
      technician: "Mike V.",
      duration: "8.00 hours (Remote)",
      summary: [
        "Performed advanced system diagnostics including CPU usage monitoring and memory optimization.",
        "Conducted engine hog analysis and application thread monitoring.",
        "Provided technical guidance to on-site staff via remote consultation.",
        "Implemented best practices for system configuration.",
        "Verified backup management procedures were being followed.",
        "Confirmed proper schedule import/export between supervisory and subordinate stations.",
        "Set up watchdog monitoring to prevent system failures due to engine thread lockups."
      ]
    }
  ],
  "Clifton Stadium Weight Room": [
    {
      date: "March 4, 2025",
      technician: "Rupert Chandool & Threshan Ramsarran",
      duration: "7.00 hours (Combined)",
      summary: [
        "Located and checked both Jace systems (one in weight room storage, another under stadium between bathrooms).",
        "All systems verified as online and functioning properly.",
        "Walkthrough conducted to identify all ERV and ERU unit locations."
      ]
    },
    {
      date: "April 9, 2025",
      technician: "Rupert Chandool",
      duration: "3.50 hours",
      summary: [
        "Performed comprehensive system check of all ERUs and VAV boxes.",
        "Verified proper operation of all units.",
        "Checked and cleared alarms.",
        "Updated system settings as needed."
      ]
    },
    {
      date: "April 23, 2025",
      technician: "Rupert Chandool",
      duration: "2.00 hours",
      summary: [
        "Complete system check with Mike.",
        "Identified filter replacement needed for ERU1 (Weights Room).",
        "Both ERVs in bathrooms operating correctly.",
        "Backed up both JACE stations."
      ]
    },
    {
      date: "May 9, 2025",
      technician: "Mike V.",
      duration: "8.00 hours (Remote)",
      summary: [
        "Performed advanced system diagnostics including CPU usage monitoring and memory optimization.",
        "Conducted engine hog analysis and application thread monitoring.",
        "Provided technical guidance to on-site staff via remote consultation.",
        "Implemented best practices for system configuration.",
        "Verified backup management procedures were being followed.",
        "Configured ERU parameters for optimal performance.",
        "Performed schedule management and optimization."
      ]
    }
  ],
  "Clifton Public School #1": [
    {
      date: "March 6, 2025",
      technician: "Rupert Chandool",
      duration: "4.00 hours",
      summary: [
        "Found RTU-1, RTU-2, and RTU-3 fan status not displaying on graphics. NY Construction team notified for follow-up.",
        "Identified overheating in rooms 105, 108, and 203 due to radiant heat not controlled by AME.",
        "Backed up Jace system."
      ]
    },
    {
      date: "April 21, 2025",
      technician: "Rupert Chandool",
      duration: "4.00 hours",
      summary: [
        "Met with Mike on-site.",
        "Discovered boilers were turned off by custodian, affecting temperature regulation.",
        "Found Daikin D-BACS (VRV system) offline.",
        "Reset offline Daikin D-BACS (VRV system) with ping commands to restore operation.",
        "Backed up JACE station after completing tasks."
      ]
    },
    {
      date: "May 2, 2025",
      technician: "Mike V.",
      duration: "8.00 hours (Remote)",
      summary: [
        "Performed advanced system diagnostics including CPU usage monitoring and memory optimization.",
        "Conducted engine hog analysis and application thread monitoring.",
        "Provided technical guidance to on-site staff via remote consultation.",
        "Implemented best practices for system configuration.",
        "Monitored and optimized VRV system settings.",
        "Analyzed fan status monitoring issues and provided recommendations.",
        "Set up enhanced system monitoring parameters."
      ]
    }
  ],
  "Clifton Public School #3": [
    {
      date: "March 21, 2025",
      technician: "Henry Sanchez & Threshan Ramsarran",
      duration: "4.00 hours (Combined)",
      summary: [
        "Reviewed platform services, daemon output and system log with no issues found. CPU usage at 19%.",
        "Found Daikin VRV network offline due to unplugged ethernet cable in panel.",
        "Network loss not affecting units' operation.",
        "Unable to determine why ethernet cable was unplugged."
      ]
    },
    {
      date: "April 11, 2025",
      technician: "Rupert Chandool",
      duration: "2.50 hours",
      summary: [
        "Verified all devices were online and communicating properly.",
        "Performed point-to-point checkout on all units.",
        "Backed up JACE station."
      ]
    },
    {
      date: "April 30, 2025",
      technician: "Rupert Chandool",
      duration: "2.00 hours",
      summary: [
        "Verified all devices were online and communicating properly.",
        "Addressed RTU-2 (Auditorium) airflow fault and filter alarms by resetting the unit.",
        "Noted filter alarms on RTU-1 (Gym) and RTU-3 (Auditorium); filters may require maintenance or replacement.",
        "Found steam boiler turned off due to lack of current demand."
      ]
    },
    {
      date: "May 6, 2025",
      technician: "Mike V.",
      duration: "8.00 hours (Remote)",
      summary: [
        "Performed advanced system diagnostics including CPU usage monitoring and memory optimization.",
        "Conducted engine hog analysis and application thread monitoring.",
        "Provided technical guidance to on-site staff via remote consultation.",
        "Implemented best practices for system configuration.",
        "Set up enhanced RTU alarm management strategies.",
        "Configured advanced system monitoring parameters.",
        "Optimized BACnet poll schedulers and subscription models."
      ]
    }
  ],
  "Clifton Public School #4": [
    {
      date: "March 21, 2025",
      technician: "Henry Sanchez & Threshan Ramsarran",
      duration: "6.50 hours (Combined)",
      summary: [
        "Reviewed platform services with no issues. CPU usage at 10%.",
        "Found AC1 in freeze stat alarm. Discovered freeze stat was set too high at 45 degrees, causing trips in warmer conditions.",
        "Reset freeze stat and verified unit operation."
      ]
    },
    {
      date: "April 11, 2025",
      technician: "Rupert Chandool",
      duration: "2.00 hours",
      summary: [
        "Met with Eric on-site.",
        "Found UV15_EF15 turned off by teacher.",
        "Discovered AC-1 supply fan was manually turned off by customer.",
        "All other systems functioning properly.",
        "Backed up JACE station."
      ]
    },
    {
      date: "May 7, 2025",
      technician: "Richard Bhajan",
      duration: "4.00 hours",
      summary: [
        "JACE backup completed.",
        "Alarm checking and clearing performed.",
        "Changed occupied setpoints per customer request.",
        "Functional testing on each unit.",
        "Noted EF 14 status issue (reading but fan running).",
        "Resolved UV 15 cooling override issue."
      ]
    },
    {
      date: "May 6, 2025",
      technician: "Mike V.",
      duration: "8.00 hours (Remote)",
      summary: [
        "Performed advanced system diagnostics including CPU usage monitoring and memory optimization.",
        "Conducted engine hog analysis and application thread monitoring.",
        "Provided technical guidance to on-site staff via remote consultation.",
        "Implemented best practices for system configuration.",
        "Provided assistance with freeze stat calibration.",
        "Set up room setpoint management protocols.",
        "Optimized poll scheduler and subscription models."
      ]
    }
  ],
  "Clifton Public School #5": [
    {
      date: "March 21, 2025",
      technician: "Henry Sanchez & Threshan Ramsarran",
      duration: "5.50 hours (Combined)",
      summary: [
        "Reviewed platform services with no issues. CPU usage at 17%.",
        "Found UV-Rm104 showing offline, turned off locally at switch.",
        "Found UV-Rm6-Art-EF showing offline, turned off locally at switch."
      ]
    },
    {
      date: "April 23, 2025",
      technician: "Rupert Chandool",
      duration: "2.50 hours",
      summary: [
        "Met with Althea on-site.",
        "Found and fixed faulty point in RTU 2 by deleting and rediscovering the point.",
        "Confirmed UV_RM6_ART_EF and UV_RM104_EF were still off locally.",
        "Observed most UV units calling for DX cooling, pending cooling system startup.",
        "Backed up JACE station."
      ]
    },
    {
      date: "April 30, 2025",
      technician: "Rupert Chandool",
      duration: "1.00 hour",
      summary: [
        "Met with Eddy to troubleshoot cooling issues in both gym spaces.",
        "Verified cooling startup sequences were correctly implemented.",
        "Confirmed space temperatures were decreasing after system startup."
      ]
    },
    {
      date: "May 8, 2025",
      technician: "Mike V.",
      duration: "8.00 hours (Remote)",
      summary: [
        "Performed advanced system diagnostics including CPU usage monitoring and memory optimization.",
        "Conducted engine hog analysis and application thread monitoring.",
        "Provided technical guidance to on-site staff via remote consultation.",
        "Implemented best practices for system configuration.",
        "Assisted with cooling startup configuration.",
        "Resolved RTU point issues via remote guidance.",
        "Optimized system parameters for seasonal operation."
      ]
    }
  ],
  "Clifton Public School #9": [
    {
      date: "March 6, 2025",
      technician: "Rupert Chandool",
      duration: "4.00 hours",
      summary: [
        "Found Daikin VRV System not yet set up for BMS integration.",
        "Discovered Classroom 210 unit was turned off; brought it back online.",
        "Identified Media Room/Library overheating due to steam heating from radiant heat.",
        "Noted Room 104 & Room 204 experiencing low temperatures, especially on very cold days.",
        "Recommended mechanical team inspection for these units.",
        "Backed up JACE system."
      ]
    },
    {
      date: "April 21, 2025",
      technician: "Rupert Chandool",
      duration: "4.00 hours",
      summary: [
        "Met with Anthony on-site.",
        "Found boilers were turned off by custodian action.",
        "Discovered Daikin D-BACS system not yet operational (still under construction for cooling startup).",
        "Found UV_RM204 unit turned off by teacher.",
        "Adjusted fan speed in Room 210 to slow per customer request.",
        "Noted that EF-6 and EF-14 have no power installed (installation pending).",
        "Backed up JACE station."
      ]
    },
    {
      date: "May 8, 2025",
      technician: "Mike V.",
      duration: "8.00 hours (Remote)",
      summary: [
        "Performed advanced system diagnostics including CPU usage monitoring and memory optimization.",
        "Conducted engine hog analysis and application thread monitoring.",
        "Provided technical guidance to on-site staff via remote consultation.",
        "Implemented best practices for system configuration.",
        "Developed VRV integration planning documentation.",
        "Assisted with temperature management troubleshooting.",
        "Recommended strategies for addressing manual override issues."
      ]
    }
  ],
  "Clifton Public School #11": [
    {
      date: "March 4, 2025",
      technician: "Rupert Chandool & Threshan Ramsarran",
      duration: "9.00 hours (Combined)",
      summary: [
        "Conducted walkthrough on location of Jace panel, UVs, ERU, VRF system and EF units.",
        "Found UV_RM01_EF off due to garbage outside pulling in odors.",
        "Found UV_RM09_EF offline, requiring a new motor.",
        "Found UV_RM02_EF fan manually overridden to stop.",
        "Found UV_RM05_EF fan stopped due to CT trip; wrapped CT to resolve.",
        "Found UV_RM24_EF heating valve at 0% with discharge at 115°F. Disconnected and reconnected valve, temperature started decreasing.",
        "Noted VRVs offline, not in use until summer startup.",
        "Backed up JACE station."
      ]
    },
    {
      date: "April 10, 2025",
      technician: "Rupert Chandool",
      duration: "3.00 hours",
      summary: [
        "Met with Mateo on-site.",
        "Verified ERUs are maintaining setpoints properly.",
        "Troubleshot heating valve on UV_RM_24_EF.",
        "Confirmed UV_RM_09_EF still requires a new blower motor.",
        "Verified UV_RM_01_EF remains off due to odor from garbage outside.",
        "Installed new C2200 current sensor on UV_RM_05_EF to resolve fan status issue.",
        "Backed up JACE station."
      ]
    },
    {
      date: "April 23, 2025",
      technician: "Rupert Chandool",
      duration: "3.50 hours",
      summary: [
        "Met with Mateo again.",
        "Found UV_RM24_EF heating valve operational but valve body leaking, requiring mechanical repair.",
        "Confirmed UV_RM01_EF still off due to odors and UV_RM09_EF still needs motor.",
        "All VRVs confirmed as offline until summer.",
        "Found JACE initial backup failed due to 100% CPU usage.",
        "Made history adjustments to optimize JACE, reducing CPU usage to ~23%.",
        "Successfully backed up JACE after optimization."
      ]
    },
    {
      date: "May 2, 2025",
      technician: "Mike V.",
      duration: "8.00 hours (Remote)",
      summary: [
        "Performed advanced system diagnostics including CPU usage monitoring and memory optimization.",
        "Conducted engine hog analysis and application thread monitoring.",
        "Provided technical guidance to on-site staff via remote consultation.",
        "Implemented best practices for system configuration.",
        "Provided CPU usage reduction techniques and implemented them remotely.",
        "Assisted with VRV system integration planning.",
        "Analyzed valve and fan performance issues, providing recommendations."
      ]
    }
  ],
  "Clifton Public School #14": [
    {
      date: "March 7, 2025",
      technician: "Rupert Chandool",
      duration: "3.00 hours",
      summary: [
        "Found HWS Pump 2 in alarm state.",
        "Discovered pump was in hand mode; switched it back to auto to resolve alarm.",
        "Verified all temperatures maintaining setpoints.",
        "Backed up JACE station."
      ]
    },
    {
      date: "April 10, 2025",
      technician: "Rupert Chandool",
      duration: "2.00 hours",
      summary: [
        "Met with Scott on-site.",
        "Found UV lights in rooms 123 and 125 were offline.",
        "Restored power to both rooms' UV lights.",
        "Discovered and fixed faulty points in ERU2 by rediscovering them.",
        "Backed up JACE station."
      ]
    },
    {
      date: "April 30, 2025",
      technician: "Rupert Chandool",
      duration: "2.00 hours",
      summary: [
        "Identified high temperatures (~80°F) in Rooms 120, 122, and 124.",
        "Troubleshot VRF system by reviewing and adjusting settings.",
        "Updated Daikin thermostat settings to appropriate modes for optimal cooling.",
        "Backed up JACE station after all adjustments."
      ]
    },
    {
      date: "May 5, 2025",
      technician: "Mike V.",
      duration: "8.00 hours (Remote)",
      summary: [
        "Performed advanced system diagnostics including CPU usage monitoring and memory optimization.",
        "Conducted engine hog analysis and application thread monitoring.",
        "Provided technical guidance to on-site staff via remote consultation.",
        "Implemented best practices for system configuration.",
        "Provided VRF/VRV integration assistance and optimization.",
        "Assisted with cooling system startup coordination.",
        "Set up enhanced monitoring for pump alarm conditions."
      ]
    }
  ],
  "Clifton School #17": [
    {
      date: "July 24, 2024",
      technician: "Richard Bhajan",
      duration: "3.50 hours",
      summary: [
        "Performed garbage collection on JACE.",
        "Completed system backup.",
        "Conducted point-to-point checkout on all units.",
        "Identified issue with RTU 5 (condenser fan fuses removed).",
        "Coordinated with customer for mechanical replacement."
      ]
    },
    {
      date: "December 13, 2024",
      technician: "Richard Bhajan",
      duration: "4.00 hours",
      summary: [
        "Backed up JACE system.",
        "Checked and cleared alarms.",
        "Performed garbage collection.",
        "Reset tripped RTU 5 and 6 units.",
        "Performed functional testing on all units."
      ]
    },
    {
      date: "April 11, 2025",
      technician: "Rupert Chandool",
      duration: "3.50 hours",
      summary: [
        "JACE Access & Device Status: Logged into JACE successfully. All devices were communicating properly, except for RTU-7.",
        "System Checks: Reviewed space temperature, discharge air temperature (DAT), and monitored for any abnormal readings. Verified alarms and fault points – all clear, except for RTU-7. Performed valve stroke tests (opened/closed) for all units.",
        "Issues Found - RTU-7: Showing offline status. Attempted to reset the unit and ping the controller – no response. RTU-7 failure affects 23 VAV boxes (no airflow to connected zones).",
        "Recommendation: A mechanical contractor is required to troubleshoot RTU-7.",
        "Final Actions: Station was saved and backed up."
      ]
    },
    {
      date: "May 5, 2025",
      technician: "Mike V.",
      duration: "8.00 hours (Remote)",
      summary: [
        "Performed advanced system diagnostics including CPU usage monitoring and memory optimization.",
        "Conducted engine hog analysis and application thread monitoring.",
        "Provided technical guidance to on-site staff via remote consultation.",
        "Implemented best practices for system configuration.",
        "Set up RTU performance monitoring protocols.",
        "Configured VAV integration management settings.",
        "Provided recommendations for addressing the RTU-7 failure affecting 23 VAV boxes."
      ]
    }
  ],
  "Clifton Early Learner Academy": [
    {
      date: "July 24, 2024",
      technician: "Richard Bhajan",
      duration: "5.00 hours",
      summary: [
        "Identified controller issues with VAV boxes 10, 16, and 18.",
        "Discovered VAV 15 showing incorrect room temperature (100°F).",
        "Recommended replacement of controllers with CVL4022AS models.",
        "Documented specific issues for follow-up."
      ]
    },
    {
      date: "December 13, 2024",
      technician: "Richard Bhajan",
      duration: "3.00 hours",
      summary: [
        "Performed JACE backup.",
        "Checked and cleared alarms.",
        "Conducted functional testing on all units."
      ]
    },
    {
      date: "February 19, 2025",
      technician: "Rupert Chandool",
      duration: "5.50 hours",
      summary: [
        "Conducted full Jace system check.",
        "Identified and documented issues with AHU-3 and AHU-4 (fail alarms).",
        "Discovered multiple VAV damper operation problems.",
        "Located reheat valve issue in Girl's Locker Room.",
        "Created comprehensive recommendations list."
      ]
    },
    {
      date: "March 24, 2025",
      technician: "Rupert Chandool",
      duration: "4.50 hours",
      summary: [
        "Communication Check: Logged into Jace and confirmed all devices are communicating.",
        "Checked space temperatures, DAT, and alarms/fault points.",
        "Stroked valves open/close for all units.",
        "AHU-3: Discovered Fail Alarm due to supply fan being off.",
        "AHU-3: Heating valve not supplying hot water → Requires mechanical inspection.",
        "AHU-4: Found Fail Alarm for return fan & filter.",
        "VAV04: Damper at 0%, but still has flow.",
        "VAV10: Damper at 100%, but no flow.",
        "VAV12, 14: Dampers at 100%, but only small flow.",
        "VAV16, 18, 20: Dampers at 100%, but no flow.",
        "Girl's Locker Room: Reheat valve at 0%, yet discharge temp = 94°F – inconsistent behavior.",
        "Recommended replacement of controller (CVL4022AS) and thermostat for VAV-18.",
        "Recommended replacement of all defective CVL4022AS controllers and associated thermostats.",
        "Saved and backed up station."
      ]
    },
    {
      date: "April 9, 2025",
      technician: "Rupert Chandool",
      duration: "4.50 hours",
      summary: [
        "Performed comprehensive system check of all AHUs and VAV boxes.",
        "AHU-3: Return fan fail alarm and filter alarm – needs customer/mechanical attention.",
        "AHU-3: Heating valve has a defective part – Honeywell ML7425A3013.",
        "AHU-3: Supply fan bearing is noisy — requires mechanical service.",
        "AHU-1: Disconnect switch not fully engaged.",
        "AHU-4: Requesting cooling, but chillers were not running (ambient temp not at setpoint).",
        "VAV-04, VAV-10, VAV-12, VAV-14, VAV-16, VAV-20: Dampers at 100%, but no box flow.",
        "VAV-18: Setpoint: 72°F, Space temperature: Overheating, Discharge temp: 109°F.",
        "Girl's Locker Room: Reheat valve at 0%, yet discharge temp = 94°F – inconsistent behavior.",
        "Recommended replacement of controller (CVL4022AS) and thermostat for VAV-18.",
        "Recommended replacement of all defective CVL4022AS controllers and associated thermostats.",
        "Backed up and saved the JACE station."
      ]
    },
    {
      date: "May 7, 2025",
      technician: "Richard Bhajan",
      duration: "4.00 hours",
      summary: [
        "Backed up JACE controller.",
        "Checked and cleared system alarms.",
        "Performed garbage collection.",
        "Conducted functional testing on all units.",
        "Identified chiller fault issue occurring twice daily due to pump overload.",
        "Noted mechanical contractor follow-up requirement."
      ]
    },
    {
      date: "May 1, 2025",
      technician: "Mike V.",
      duration: "8.00 hours (Remote)",
      summary: [
        "Performed advanced system diagnostics including CPU usage monitoring and memory optimization.",
        "Conducted engine hog analysis and application thread monitoring.",
        "Provided technical guidance to on-site staff via remote consultation.",
        "Implemented best practices for system configuration.",
        "Verified backup management procedures were being followed.",
        "Confirmed proper schedule import/export between supervisory and subordinate stations.",
        "Set up watchdog monitoring to prevent system failures due to engine thread lockups."
      ]
    }
  ]
};

// -----------------------------
// Helper functions
// -----------------------------
const readPublicJson = async (fileName) => {
  const fullPath = path.join(process.cwd(), 'public', 'data', fileName);
  try {
    const content = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    // Fallback if not present
    return fileName.endsWith('.json') ? (fileName.includes('supervisors') ? [] : {}) : null;
  }
};

const avg = (nums) => nums.reduce((a, b) => a + b, 0) / Math.max(1, nums.length);

const toMonthLabel = (mmddyyyy) => {
  const [mm, dd, yyyy] = mmddyyyy.split('/');
  const d = new Date(`${yyyy}-${mm}-${dd}`);
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

// -----------------------------
// Main loader
// -----------------------------
export async function getReportData(id = 'default') {
  // Inventory: read from public/data
  const supervisors = await readPublicJson('supervisors.json'); // Array
  const deviceData = await readPublicJson('device-data.json');  // Object keyed by station name

  // Meta
  const meta = {
    id,
    customer: 'Clifton Public Schools',
    periodLabel: 'July 2024 – May 2025',
    generatedAt: new Date().toISOString(),
  };

  // KPIs
  const kpis = {
    schools: schoolData.length,
    visits: visitData.length, // total entries
    hours: Number(visitData.reduce((sum, v) => sum + (Number(v.hours) || 0), 0).toFixed(1)),
    technicians: new Set(technicianData.map(t => t.name)).size,
  };

  // Map data
  const map = {
    center: [
      Number(avg(schoolData.map(s => s.lat)).toFixed(6)),
      Number(avg(schoolData.map(s => s.lng)).toFixed(6)),
    ],
    markers: schoolData.map(s => ({
      lat: s.lat,
      lng: s.lng,
      hours: s.hours,
      label: s.label || s.name.charAt(0)
    }))
  };

  // Metrics
  const totalHours = kpis.hours || 1;
  const metrics = {
    bySchool: schoolData.map(s => ({ school: s.name, hours: s.hours })),
    byMonth: monthlyHours.map(m => ({ month: m.month, hours: m.hours })),
    byTech: technicianData.map(t => ({
      tech: t.name,
      visits: t.visits,
      hours: t.hours,
      sharePct: Number(((t.hours / totalHours) * 100).toFixed(2))
    })),
    bySchoolTable: schoolData.map(s => ({
      school: s.name,
      address: s.address,
      visits: s.visits,
      hours: s.hours,
    }))
  };

  // Issues
  const issuesTotals = {
    schools: 11,
    issues: issueSchoolCounts.reduce((sum, it) => sum + it.count, 0),
    categories: issueCards.length,
  };
  const issues = {
    totals: issuesTotals,
    bySchool: issueSchoolCounts,
    cards: issueCards,
  };

  // Inventory
  const modelsMap = {};
  const versionsMap = {};
  const statusMap = {};
  const connStatus = { Connected: 0, 'Not connected': 0 };

  for (const s of supervisors) {
    if (s.hostModel) modelsMap[s.hostModel] = (modelsMap[s.hostModel] || 0) + 1;
    if (s.version) versionsMap[s.version] = (versionsMap[s.version] || 0) + 1;
    const statusKey = s.status || 'unknown';
    statusMap[statusKey] = (statusMap[statusKey] || 0) + 1;
    if (s.clientConn) connStatus[s.clientConn] = (connStatus[s.clientConn] || 0) + 1;
  }

  const inventory = {
    summary: {
      jaces: supervisors.length,
      bacnet: Object.values(deviceData).reduce((sum, v) => sum + (v.devices || 0), 0),
      points: Object.values(deviceData).reduce((sum, v) => sum + (v.points || 0), 0),
      systems: schoolData.length,
    },
    models: Object.entries(modelsMap).map(([label, count]) => ({ label, pct: count })),
    versions: Object.entries(versionsMap).map(([label, count]) => ({ label, pct: count })),
    connStatus: {
      connectedPct: Number(((connStatus.Connected || 0) / Math.max(1, supervisors.length) * 100).toFixed(2)),
      notConnectedPct: Number(((connStatus['Not connected'] || 0) / Math.max(1, supervisors.length) * 100).toFixed(2)),
    },
    jaceStatus: Object.entries(statusMap).map(([label, count]) => ({ label, pct: Number(((count / Math.max(1, supervisors.length)) * 100).toFixed(2)) })),
    bySchoolDevicesPoints: Object.values(deviceData).map((v) => ({
      school: v.stationName || 'Unknown',
      devices: v.devices || 0,
      points: v.points || 0,
    })),
    jaceStatusTable: supervisors.map(s => ({
      name: s.name,
      ip: s.address,
      model: s.hostModel,
      version: s.version,
      health: s.health,
      clientConn: s.clientConn,
    }))
  };

  // Timeline and Visit Logs
  const timeline = {
    monthWeeks: calendarData.map(m => ({
      month: m.month,
      weeks: Object.entries(m.weeks).map(([label, hours]) => ({ label, hours }))
    })),
    visits: visitData.map(v => ({ date: v.date, school: v.school, tech: v.tech, hours: v.hours, work: [] }))
  };

  const visitLogs = Object.entries(visitLogBySchool).map(([school, entries]) => {
    const parsed = entries.map(e => ({
      date: e.date,
      tech: e.technician,
      hours: parseFloat(String(e.duration)) || 0,
      work: e.summary || []
    }));
    return {
      school,
      totalVisits: parsed.length,
      totalHours: Number(parsed.reduce((sum, e) => sum + (e.hours || 0), 0).toFixed(1)),
      entries: parsed,
    };
  });

  // Executive summary additions
  const summary = {
    keyFindings: [
      'RTU communication failures impacting ventilation and temperature control (notably PS #17; RTU-7 affects 23 VAV boxes)',
      'Recurring freeze-stat trips (up to 58°F) particularly at Clifton High School',
      'Heating valve defects causing temperature control issues (e.g., ELA Honeywell ML7425A3013)',
      'Building Automation (JACE) performance issues requiring optimization (PS #11 100% CPU pre-optimization)',
      'Manual system overrides by staff affecting performance across 7 schools (64% of facilities)',
      'VRV/VRF integration gaps preventing full BMS functionality (PS #9, #11, #3, #1, #14)',
      'VAV damper flow issues despite dampers at 100%',
      'Seasonal heating-to-cooling transition difficulties',
      'Chiller faults at ELA with pump overload occurring twice daily'
    ],
    recommendations: [
      { issue: 'RTU Communication Failures', priority: 'High', action: 'Schedule immediate mechanical contractor inspection for all affected units' },
      { issue: 'Freeze Stat Problems', priority: 'High', action: 'Comprehensive inspection and recalibration across district' },
      { issue: 'Heating Valve Defects', priority: 'High', action: 'Replace defective Honeywell ML7425A3013 actuators and repair valve body leaks' },
      { issue: 'VRV/VRF Integration', priority: 'High', action: 'Accelerate BMS integration prior to peak cooling season' },
      { issue: 'Manual System Overrides', priority: 'Medium', action: 'Staff education + control lockouts to prevent shutdowns' },
      { issue: 'JACE Optimization', priority: 'Medium', action: 'Apply optimization playbook (as done at PS #11) across district' },
      { issue: 'Seasonal Transitions', priority: 'Medium', action: 'Create standardized seasonal transition protocols' },
      { issue: 'Chiller Faults', priority: 'High', action: 'Mechanical inspection of pump overload and controls' }
    ],
    mostServiced: schoolData
      .map(s => ({ school: s.name, address: s.address, visits: s.visits, hours: s.hours }))
      .sort((a,b) => b.hours - a.hours)
      .slice(0, 3)
  };

  return {
    meta,
    kpis,
    map,
    metrics,
    issues,
    inventory,
    timeline,
    visitLogs,
    summary,
  };
}
