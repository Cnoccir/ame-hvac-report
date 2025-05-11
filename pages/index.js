import React, { useState } from 'react';
import { LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { Menu, X, Calendar, Map, Settings, Clock, BarChart2, FileText, AlertTriangle } from 'lucide-react';
import Head from 'next/head';

// AME Inc. brand colors - updated to match your logo with more subtle tones
const COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  lightGrey: "#F2F2F2",
  mediumGrey: "#DDDDDD",
  darkGrey: "#777777",
  red: "#E83A3A",       // More subtle red accent color
  navy: "#1D0F5A",      // Navy blue from logo
  blue: "#3A6EE8",      // Blue accent that complements the navy
  lightBlue: "#6AAFE8", // Lighter blue for tertiary elements
  gray: "#666666"       // Gray for "INC." text
};

// School data with coordinates derived from the map
const schoolData = [
  {
    id: 1,
    name: "Clifton High School",
    address: "333 Colfax Avenue",
    visits: 3,
    hours: 21.5,
    lat: 40.868,
    lng: -74.164,
    technicians: ["Rupert Chandool", "Richard Bhajan"],
    imageUrl: "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/CliftonHS.png"
  },
  {
    id: 2,
    name: "Clifton Stadium Weight Room",
    address: "350 Piaget Avenue",
    visits: 2,
    hours: 9,
    lat: 40.875,
    lng: -74.163,
    technicians: ["Rupert Chandool", "Threshan Ramsarran"],
    imageUrl: "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/Clifton+Stadium+Weight+Room.png"
  },
  {
    id: 3,
    name: "Clifton Public School #1",
    address: "158 Park Slope",
    visits: 2,
    hours: 8,
    lat: 40.879,
    lng: -74.168,
    technicians: ["Rupert Chandool"],
    imageUrl: "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/CliftonPS1.png"
  },
  {
    id: 4,
    name: "Clifton Public School #3",
    address: "365 Washington Avenue",
    visits: 2,
    hours: 6,
    lat: 40.876,
    lng: -74.165,
    technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran"],
    imageUrl: "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/CliftonPS3.png"
  },
  {
    id: 5,
    name: "Clifton Public School #4",
    address: "194 West 2nd Street",
    visits: 2,
    hours: 5,
    lat: 40.882,
    lng: -74.163,
    technicians: ["Rupert Chandool", "Henry Sanchez"],
    imageUrl: "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/CliftonPS4.png"
  },
  {
    id: 6,
    name: "Clifton Public School #5",
    address: "136 Valley Road",
    visits: 3,
    hours: 9,
    lat: 40.888,
    lng: -74.167,
    technicians: ["Rupert Chandool", "Henry Sanchez", "Threshan Ramsarran"],
    imageUrl: "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/CliftonPS5.png"
  },
  {
    id: 7,
    name: "Clifton Public School #9",
    address: "25 Brighton Road",
    visits: 2,
    hours: 8,
    lat: 40.857,
    lng: -74.163,
    technicians: ["Rupert Chandool"],
    imageUrl: "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/CliftonPS9.png"
  },
  {
    id: 8,
    name: "Clifton Public School #11",
    address: "147 Merselis Avenue",
    visits: 3,
    hours: 15.5,
    lat: 40.885,
    lng: -74.153,
    technicians: ["Rupert Chandool", "Threshan Ramsarran"],
    imageUrl: "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/CliftonPS11.png"
  },
  {
    id: 9,
    name: "Clifton Public School #14",
    address: "99 Saint Andrews Blvd",
    visits: 3,
    hours: 7,
    lat: 40.865,
    lng: -74.165,
    technicians: ["Rupert Chandool"],
    imageUrl: "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/CliftonPS14.png"
  },
  {
    id: 10,
    name: "Clifton School #17",
    address: "361 Lexington Avenue, Clifton NJ 07011",
    visits: 1,
    hours: 3.5,
    lat: 40.872,
    lng: -74.159,
    technicians: ["Rupert Chandool"],
    imageUrl: "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/CliftonPS17.png"
  },
  {
    id: 11,
    name: "Clifton Early Learner Academy",
    address: "290 Brighton Road, Clifton NJ 07012",
    visits: 2,
    hours: 9,
    lat: 40.855,
    lng: -74.167,
    technicians: ["Rupert Chandool"],
    imageUrl: "https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/CliftonELA.png"
  }
];

// Technician data
const technicianData = [
  { name: "Rupert Chandool", visits: 22, hours: 76 },
  { name: "Richard Bhajan", visits: 1, hours: 5.5 },
  { name: "Henry Sanchez", visits: 3, hours: 8 },
  { name: "Threshan Ramsarran", visits: 4, hours: 12.5 }
];

// Visit timeline data
const visitData = [
  { date: "03/03/2025", school: "Clifton HS", tech: "Rupert Chandool", hours: 8 },
  { date: "03/04/2025", school: "Clifton Stadium Weight Room", tech: "Rupert Chandool, Threshan Ramsarran", hours: 7 },
  { date: "03/04/2025", school: "Clifton Public School #11", tech: "Rupert Chandool, Threshan Ramsarran", hours: 9 },
  { date: "03/06/2025", school: "Clifton Public School #1", tech: "Rupert Chandool", hours: 4 },
  { date: "03/06/2025", school: "Clifton Public School #9", tech: "Rupert Chandool", hours: 4 },
  { date: "03/07/2025", school: "Clifton Public School #14", tech: "Rupert Chandool", hours: 3 },
  { date: "03/21/2025", school: "Clifton Public School #3", tech: "Henry Sanchez, Threshan Ramsarran", hours: 4 },
  { date: "03/21/2025", school: "Clifton Public School #4", tech: "Henry Sanchez", hours: 3 },
  { date: "03/21/2025", school: "Clifton Public School #5", tech: "Henry Sanchez, Threshan Ramsarran", hours: 5.5 },
  { date: "03/24/2025", school: "Clifton HS", tech: "Richard Bhajan", hours: 5.5 },
  { date: "03/24/2025", school: "Clifton Early Learner Academy", tech: "Rupert Chandool", hours: 4.5 },
  { date: "04/09/2025", school: "Clifton Early Learner Academy", tech: "Rupert Chandool", hours: 4.5 },
  { date: "04/10/2025", school: "Clifton Public School #11", tech: "Rupert Chandool", hours: 3 },
  { date: "04/10/2025", school: "Clifton Public School #14", tech: "Rupert Chandool", hours: 2 },
  { date: "04/11/2025", school: "Clifton Public School #4", tech: "Rupert Chandool", hours: 2 },
  { date: "04/11/2025", school: "Clifton School #17", tech: "Rupert Chandool", hours: 3.5 },
  { date: "04/21/2025", school: "Clifton Public School #1", tech: "Rupert Chandool", hours: 4 },
  { date: "04/21/2025", school: "Clifton Public School #9", tech: "Rupert Chandool", hours: 4 },
  { date: "04/23/2025", school: "Clifton Stadium Weight Room", tech: "Rupert Chandool", hours: 2 },
  { date: "04/23/2025", school: "Clifton Public School #5", tech: "Rupert Chandool", hours: 2.5 },
  { date: "04/23/2025", school: "Clifton Public School #11", tech: "Rupert Chandool", hours: 3.5 },
  { date: "04/25/2025", school: "Clifton HS", tech: "Rupert Chandool", hours: 8 },
  { date: "04/30/2025", school: "Clifton Public School #3", tech: "Rupert Chandool", hours: 2 },
  { date: "04/30/2025", school: "Clifton Public School #5", tech: "Rupert Chandool", hours: 1 },
  { date: "04/30/2025", school: "Clifton Public School #14", tech: "Rupert Chandool", hours: 2 }
];

// Issues data - updated to match the IssueAnalysis component
const issueData = [
  {
    id: 1,
    name: "RTU Communication Failures",
    priority: "High",
    frequency: "27%",
    schools: 3,
    description: "Multiple RTUs showing offline status, affecting ventilation and temperature control in connected zones",
    recommendation: "Schedule immediate mechanical contractor inspection for all affected units"
  },
  {
    id: 2,
    name: "AHU Heating Valve Defects",
    priority: "High",
    frequency: "36%",
    schools: 4,
    description: "Heating valves not supplying hot water, causing temperature control issues in multiple zones",
    recommendation: "Replace defective Honeywell ML7425A3013 parts and repair valve bodies"
  },
  {
    id: 3,
    name: "VAV Damper Flow Issues",
    priority: "Medium",
    frequency: "18%",
    schools: 2,
    description: "Multiple VAV boxes showing dampers at 100% with minimal or no airflow to zones",
    recommendation: "Replace all defective CVL4022AS controllers and associated thermostats"
  },
  {
    id: 4,
    name: "AHU Fan Failures",
    priority: "High",
    frequency: "36%",
    schools: 4,
    description: "Supply and return fan failures detected across multiple units, causing insufficient air distribution",
    recommendation: "Comprehensive mechanical service for bearing replacement and fan alignment"
  },
  {
    id: 5,
    name: "JACE System Management",
    priority: "Medium",
    frequency: "27%",
    schools: 3,
    description: "JACE system showing communication gaps with certain devices and controllers. PS #11 experienced 100% CPU usage",
    recommendation: "System-wide control network analysis and firmware updates"
  },
  {
    id: 6,
    name: "Freeze Stat Problems",
    priority: "High",
    frequency: "36%",
    schools: 4,
    description: "Units tripping at abnormally warm temperatures (up to 58°F), causing system shutdowns",
    recommendation: "Comprehensive inspection and recalibration of all freeze stats"
  },
  {
    id: 7,
    name: "Manual System Overrides",
    priority: "Medium",
    frequency: "64%",
    schools: 7,
    description: "Units manually deactivated or placed in inappropriate modes by staff, affecting system performance",
    recommendation: "Staff education program and consideration of control lockouts"
  },
  {
    id: 8,
    name: "Daikin VRV/VRF Integration",
    priority: "High",
    frequency: "45%",
    schools: 5,
    description: "Daikin VRV/VRF systems not properly integrated with BMS or showing offline status",
    recommendation: "Accelerated Daikin integration project before peak cooling season"
  },
  {
    id: 9,
    name: "Filter Maintenance",
    priority: "Low",
    frequency: "36%",
    schools: 4,
    description: "Filter alarms on multiple units (RTUs, AHUs)",
    recommendation: "Proactive filter replacement schedule aligned with manufacturer specs"
  }
];

// Detailed visit log data
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
      date: "April 23, 2025",
      technician: "Rupert Chandool",
      duration: "2.00 hours",
      summary: [
        "Complete system check with Mike.",
        "Identified filter replacement needed for ERU1 (Weights Room).",
        "Both ERVs in bathrooms operating correctly.",
        "Backed up both JACE stations."
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
      date: "April 30, 2025",
      technician: "Rupert Chandool",
      duration: "2.00 hours",
      summary: [
        "Verified all devices were online and communicating properly.",
        "Addressed RTU-2 (Auditorium) airflow fault and filter alarms by resetting the unit.",
        "Noted filter alarms on RTU-1 (Gym) and RTU-3 (Auditorium); filters may require maintenance or replacement.",
        "Found steam boiler turned off due to lack of current demand."
      ]
    }
  ],
  "Clifton Public School #4": [
    {
      date: "March 21, 2025",
      technician: "Henry Sanchez",
      duration: "3.00 hours",
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
    }
  ],
  "Clifton School #17": [
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
    }
  ],
  "Clifton Early Learner Academy": [
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
        "Girl's Locker Room: Reheat valve at 0%, but discharge temp at 114°F → Requires mechanical inspection.",
        "Recommended replacement of CVL4022AS control valve and thermostat.",
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
    }
  ]
};

// Create monthly hours data for line chart - updated to be accurate
const monthlyHours = [
  { month: "March", hours: 59.5 },
  { month: "April", hours: 42.5 }
];

// Create month + week data for heat calendar
const marchWeeks = ["Week 1 (3/1-3/7)", "Week 2 (3/8-3/14)", "Week 3 (3/15-3/21)", "Week 4 (3/22-3/28)"];
const aprilWeeks = ["Week 1 (4/1-4/7)", "Week 2 (4/8-4/14)", "Week 3 (4/15-4/21)", "Week 4 (4/22-4/28)", "Week 5 (4/29-4/30)"];

const calendarData = [
  { month: "March", weeks: {
    "Week 1 (3/1-3/7)": 35,
    "Week 2 (3/8-3/14)": 0,
    "Week 3 (3/15-3/21)": 12.5,
    "Week 4 (3/22-3/28)": 19
  }},
  { month: "April", weeks: {
    "Week 1 (4/1-4/7)": 0,
    "Week 2 (4/8-4/14)": 15.5,
    "Week 3 (4/15-4/21)": 8,
    "Week 4 (4/22-4/28)": 10,
    "Week 5 (4/29-4/30)": 5
  }}
];

// Custom AME Inc. styled components
const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-bold uppercase mb-1 text-black">{children}</h3>
);

const SectionSubtitle = ({ children }) => (
  <p className="text-sm text-gray-600 mb-4">March-April 2025 | Clifton Public Schools</p>
);

const Subheading = ({ children }) => (
  <h4 className="font-bold text-base mb-2 text-black">{children}</h4>
);

// Import AME Logo component
import AmeLogo from '../components/AmeLogo';

// Footer Component
const Footer = () => (
  <footer className="bg-navy text-white py-4 mt-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-4 md:mb-0">
        <AmeLogo size="small" />
      </div>
      <p className="text-sm text-gray-300 my-2 md:my-0">Copyright 2025 AME-INC All Rights Reserved</p>
      <p className="text-sm text-gray-300">Page 1 of 1</p>
    </div>
  </footer>
);

// Component for the school map using standard Google Maps markers with all 11 schools
import StandardMapView from '../components/StandardMapView';
const MapView = StandardMapView;

// Component for service metrics
const MetricsView = () => {
  return (
    <div>
      <SectionTitle>SERVICE METRICS OVERVIEW</SectionTitle>
      <SectionSubtitle />

      {/* Summary statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-red">
          <div className="text-3xl font-bold text-black">11</div>
          <div className="text-sm font-medium text-gray-600">Schools Serviced</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-red">
          <div className="text-3xl font-bold text-black">24</div>
          <div className="text-sm font-medium text-gray-600">Total Visits</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-red">
          <div className="text-3xl font-bold text-black">102</div>
          <div className="text-sm font-medium text-gray-600">Labor Hours</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-red">
          <div className="text-3xl font-bold text-black">4</div>
          <div className="text-sm font-medium text-gray-600">Technicians</div>
        </div>
      </div>

      {/* Labor hours by school chart */}
      <div className="mb-8">
        <Subheading>Labor Hours by School</Subheading>
        <div className="bg-white p-4 rounded-lg shadow h-64 border border-gray-200">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={schoolData.sort((a, b) => b.hours - a.hours)}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightGrey} />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{fontSize: 10}} />
              <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} hours`, 'Service Hours']} />
              <Bar dataKey="hours" fill={COLORS.red} name="Service Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* March vs April hours comparison */}
      <div className="mb-8">
        <Subheading>Monthly Service Hours</Subheading>
        <div className="bg-white p-4 rounded-lg shadow h-64 border border-gray-200">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyHours}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.lightGrey} />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} hours`, 'Service Hours']} />
              <Legend />
              <Line type="monotone" dataKey="hours" stroke={COLORS.red} activeDot={{ r: 8 }} name="Service Hours" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technician data table */}
      <div className="mb-6">
        <Subheading>Service by Technician</Subheading>
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Technician
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Visits
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Hours
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  % of Total Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {technicianData.map((tech, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {tech.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {tech.visits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {tech.hours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {Math.round((tech.hours / 102) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* School data table */}
      <div>
        <Subheading>Service by School</Subheading>
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  School
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Visits
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schoolData.map((school, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {school.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {school.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {school.visits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {school.hours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Component for timeline view
const TimelineView = () => {
  // Group visits by week
  const groupedVisits = {};

  visitData.forEach(visit => {
    const dateObj = new Date(visit.date);
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const weekOfMonth = Math.ceil(dateObj.getDate() / 7);
    const weekKey = `${month} Week ${weekOfMonth}`;

    if (!groupedVisits[weekKey]) {
      groupedVisits[weekKey] = [];
    }

    groupedVisits[weekKey].push(visit);
  });

  return (
    <div>
      <SectionTitle>SERVICE VISIT TIMELINE</SectionTitle>
      <SectionSubtitle />

      {/* Service intensity calendar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <Subheading>Service Intensity Calendar</Subheading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calendarData.map((monthData, idx) => (
            <div key={idx} className="border rounded p-2">
              <h5 className="font-medium text-center mb-2">{monthData.month} 2025</h5>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(monthData.weeks).map(([week, hours], i) => (
                  <div key={i} className="flex items-center">
                    <div className="text-xs w-24 text-gray-600">{week}</div>
                    <div className="flex-grow h-8 rounded-md relative"
                      style={{
                        backgroundColor: hours > 0
                          ? `rgba(232, 58, 58, ${Math.min(0.2 + (hours / 40), 0.8)})`
                          : COLORS.lightGrey
                      }}
                    >
                      {hours > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                          {hours} hrs
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline visualization */}
      <div className="mb-6">
        <Subheading>Service Activity Timeline</Subheading>

        {Object.entries(groupedVisits).map(([weekName, visits], weekIdx) => (
          <div key={weekIdx} className="mb-8">
            <h5 className="font-medium text-black border-b border-gray-300 pb-1 mb-2">{weekName}</h5>

            <div className="space-y-4">
              {visits.map((visit, visitIdx) => (
                <div key={visitIdx} className="flex">
                  <div className="mr-4 text-center">
                    <div className="w-16 text-xs bg-gray-100 rounded-t p-1 font-semibold">
                      {new Date(visit.date).toLocaleString('default', { month: 'short' })}
                    </div>
                    <div className="w-16 h-12 flex items-center justify-center font-bold text-lg rounded-b text-white" style={{ backgroundColor: COLORS.red }}>
                      {new Date(visit.date).getDate()}
                    </div>
                  </div>

                  <div className="flex-grow bg-white rounded-lg shadow p-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <h6 className="font-semibold text-black">{visit.school}</h6>
                      <span className="bg-gray-100 text-black text-xs px-2 py-1 rounded font-medium">
                        {visit.hours} hrs
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Technician: {visit.tech}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Import the new IssueAnalysis component
import IssueAnalysis from '../components/IssueAnalysis';

// Component for issue analysis - now using our updated component
const IssueAnalysisView = () => {
  return <IssueAnalysis />;
};

// Component for detailed visit logs
const VisitLogView = () => {
  const [expandedSchool, setExpandedSchool] = useState(null);

  return (
    <div>
      <SectionTitle>DETAILED VISIT LOGS BY SCHOOL</SectionTitle>
      <SectionSubtitle />

      {/* Accordions for each school */}
      <div className="space-y-4">
        {Object.entries(visitLogBySchool).map(([schoolName, visits], schoolIdx) => (
          <div key={schoolIdx} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <button
              className="w-full px-4 py-3 text-left font-medium flex justify-between items-center focus:outline-none bg-gray-50 border-b border-gray-200"
              onClick={() => setExpandedSchool(expandedSchool === schoolName ? null : schoolName)}
            >
              <span className="text-black">{schoolName}</span>
              <span className="text-gray-600">
                {visits.length} visits | {visits.reduce((total, visit) => total + parseFloat(visit.duration), 0)} hours
              </span>
            </button>

            {expandedSchool === schoolName && (
              <div className="px-4 pb-4 space-y-3 pt-2">
                {visits.map((visit, visitIdx) => (
                  <div key={visitIdx} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-black">{visit.date}</div>
                      <div className="text-sm text-gray-600">{visit.duration}</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">Technician: {visit.technician}</div>
                    <div className="mt-2 pt-2 border-t">
                      <div className="text-sm font-medium mb-1 text-black">Work Completed:</div>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        {visit.summary.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for executive summary
const ExecutiveSummaryView = () => {
  return (
    <div>
      <div className="text-center mb-6">
        <AmeLogo size="large" />
        <div className="mt-4">
          <SectionTitle>EXECUTIVE SUMMARY</SectionTitle>
          <SectionSubtitle />
        </div>
      </div>

      {/* Company info and header information */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-base font-bold text-black">AME Inc.</div>
          <div className="text-sm text-gray-600">1275 Bloomfield Ave., Building 2 Suite 17B</div>
          <div className="text-sm text-gray-600">Fairfield, NJ 07004</div>
          <div className="text-sm text-gray-600">Tel: (973) 884-4100</div>
        </div>
        <div className="bg-gray-100 p-3 rounded border-l-4 border-red">
          <div className="text-xl font-bold text-black">HVAC SERVICE REPORT</div>
          <div className="text-sm text-gray-600">Generated: May 8, 2025</div>
        </div>
      </div>

      {/* Summary statistics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-red">
          <div className="text-3xl font-bold text-black">11</div>
          <div className="text-sm font-medium text-gray-600">Schools</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-red">
          <div className="text-3xl font-bold text-black">24</div>
          <div className="text-sm font-medium text-gray-600">Visits</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-red">
          <div className="text-3xl font-bold text-black">102</div>
          <div className="text-sm font-medium text-gray-600">Hours</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center border-t-4 border-red">
          <div className="text-3xl font-bold text-black">4</div>
          <div className="text-sm font-medium text-gray-600">Technicians</div>
        </div>
      </div>

      {/* Summary text */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
        <p className="mb-4 text-black">
          Between March 3 and April 30, 2025, AME Inc. conducted <strong>24 maintenance visits</strong> across eleven Clifton Public School facilities, totaling <strong>102 labor hours</strong>. This bi-weekly maintenance program has provided consistent monitoring, troubleshooting, and seasonal transition services for the district's HVAC systems.
        </p>

        <div className="mb-4">
          <h4 className="font-bold mb-2 text-black">Key Findings</h4>
          <ul className="list-disc pl-5 space-y-1 text-black">
            <li><strong>RTU Communication Failures</strong> affecting ventilation and temperature control at multiple schools, most notably PS #17 where RTU-7 failure impacts 23 VAV boxes</li>
            <li><strong>Recurring freeze stat issues</strong>, particularly at Clifton High School, with triggers at abnormally high temperatures (up to 58°F)</li>
            <li><strong>Building Automation System (JACE) challenges</strong> requiring regular intervention and optimization (100% CPU usage at PS #11)</li>
            <li><strong>AHU Heating Valve Defects</strong> causing temperature control issues, especially at Early Learner Academy</li>
            <li><strong>Daikin VRV/VRF integration gaps</strong> at multiple schools preventing full BMS functionality</li>
            <li><strong>Manual system overrides</strong> by staff affecting system performance at 7 schools (64% of facilities)</li>
            <li><strong>VAV damper flow issues</strong> causing airflow problems despite dampers at 100% position</li>
            <li><strong>Seasonal heating-to-cooling transition difficulties</strong></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-2 text-black">Recommendations</h4>
          <p className="mb-2 text-black">Based on these observations, we recommend:</p>
          <ul className="list-disc pl-5 space-y-1 text-black">
            <li>Schedule immediate mechanical contractor inspection for RTU communication failures, particularly at PS #17</li>
            <li>Comprehensive inspection and recalibration of all freeze stats district-wide, especially at Clifton High School</li>
            <li>Replace defective Honeywell ML7425A3013 valve actuators and repair valve body leaks</li>
            <li>Replace all defective CVL4022AS controllers and associated thermostats at affected schools</li>
            <li>Implement staff education program and consider control lockouts to prevent unauthorized equipment shutdowns</li>
            <li>Accelerate Daikin VRV/VRF integration with BMS before peak cooling season at PS #9, PS #11, PS #3, PS #1, and PS #14</li>
            <li>Perform JACE system optimization at all locations, following the successful CPU usage reduction at PS #11</li>
            <li>Create standardized seasonal transition protocols to prevent boiler shutdowns and cooling startup issues</li>
          </ul>
        </div>
      </div>

      {/* Most serviced schools */}
      <div className="mb-6">
        <Subheading>Most Serviced Locations</Subheading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schoolData.sort((a, b) => b.hours - a.hours).slice(0, 3).map((school, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <div className="h-40 bg-gray-100">
                <img
                  src={school.imageUrl}
                  alt={school.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h5 className="font-semibold text-black">{school.name}</h5>
                <p className="text-sm text-gray-600">{school.address}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-800">{school.visits} visits</span>
                  <span className="text-sm font-medium text-red">{school.hours} hours</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical issues */}
      <div>
        <Subheading>Critical Issues Requiring Follow-up</Subheading>
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Issue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Schools Affected
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Recommendation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="bg-white">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  RTU Communication Failures
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <span className="text-xs px-2 py-1 rounded font-medium bg-red-100 text-red-800">
                    High
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  3 (27%)
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  Schedule immediate mechanical contractor inspection for all affected units
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  Freeze Stat Problems
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <span className="text-xs px-2 py-1 rounded font-medium bg-red-100 text-red-800">
                    High
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  4 (36%)
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  Comprehensive inspection and recalibration of all freeze stats
                </td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  AHU Heating Valve Defects
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <span className="text-xs px-2 py-1 rounded font-medium bg-red-100 text-red-800">
                    High
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  4 (36%)
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  Replace defective Honeywell ML7425A3013 parts and repair valve bodies
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  Daikin VRV/VRF Integration
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <span className="text-xs px-2 py-1 rounded font-medium bg-red-100 text-red-800">
                    High
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  5 (45%)
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  Accelerated Daikin integration project before peak cooling season
                </td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                  Manual System Overrides
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <span className="text-xs px-2 py-1 rounded font-medium bg-gray-200 text-gray-800">
                    Medium
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  7 (64%)
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  Staff education program and consideration of control lockouts
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main application component
export default function HVACServiceReport() {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [activeTab, setActiveTab] = useState('executive');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tab configuration
  const tabs = [
    { id: 'executive', label: 'Executive Summary', icon: <FileText size={16} /> },
    { id: 'map', label: 'Service Map', icon: <Map size={16} /> },
    { id: 'metrics', label: 'Service Metrics', icon: <BarChart2 size={16} /> },
    { id: 'timeline', label: 'Timeline', icon: <Calendar size={16} /> },
    { id: 'issues', label: 'Issue Analysis', icon: <AlertTriangle size={16} /> },
    { id: 'visits', label: 'Visit Logs', icon: <Clock size={16} /> }
  ];

  return (
    <>
      <Head>
        <title>AME Inc. - Clifton Schools HVAC Report</title>
        <meta name="description" content="HVAC Service Report for Clifton Public Schools" />
        <link rel="icon" href="https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/favicon.ico" />
        <style jsx global>{`
          :root {
            --color-navy: #1D0F5A;
            --color-red: #FF1E1E;
          }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
              Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          }
          .text-red {
            color: var(--color-red);
          }
          .bg-navy {
            background-color: var(--color-navy);
          }
          .bg-red {
            background-color: var(--color-red);
          }
          .border-red {
            border-color: var(--color-red);
          }
          .border-l-red {
            border-left-color: var(--color-red);
          }
          .border-t-red {
            border-top-color: var(--color-red);
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-white font-sans">
        {/* Header */}
        <header className="bg-navy text-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <AmeLogo size="small" />
              <h1 className="ml-4 text-xl font-bold uppercase">Clifton Public Schools HVAC Analysis</h1>
            </div>
            <div className="text-sm">March-April 2025</div>
            <button
              className="md:hidden p-2 rounded border border-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={20} color="white" />
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile navigation menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mb-4 bg-white rounded-lg shadow border border-gray-200">
              <div className="p-2 space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`w-full px-3 py-2 rounded-md text-left flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-red-50 text-red font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Desktop tabs */}
          <div className="hidden md:block mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-6">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-red text-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            {activeTab === 'executive' && <ExecutiveSummaryView />}
            {activeTab === 'map' && <MapView selectedSchool={selectedSchool} setSelectedSchool={setSelectedSchool} />}
            {activeTab === 'metrics' && <MetricsView />}
            {activeTab === 'timeline' && <TimelineView />}
            {activeTab === 'issues' && <IssueAnalysisView />}
            {activeTab === 'visits' && <VisitLogView />}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
