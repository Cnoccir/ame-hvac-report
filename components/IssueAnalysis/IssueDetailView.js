import React from 'react';
import { X, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

// Visit log reference data for the selected issue
const visitLogData = {
  '211664-13788': {
    jobNo: '211664-13788',
    customerName: 'CLIFTON BOARD OF EDUCATION (ESCNJ)',
    siteName: 'Clifton School #17',
    address: '361 Lexington Avenue, Clifton NJ 07011',
    serviceDate: '04/11/2025',
    technician: 'Rupert Chandool',
    workCompleted: [
      'Logged into JACE successfully.',
      'All devices were communicating properly, except for RTU-7.',
      'Reviewed space temperature, discharge air temperature (DAT), and monitored for any abnormal readings.',
      'Verified alarms and fault points – all clear, except for RTU-7.',
      'Performed valve stroke tests (opened/closed) for all units.'
    ],
    issuesFound: [
      'RTU-7 showing offline status.',
      'Attempted to reset the unit and ping the controller – no response.',
      'RTU-7 failure affects 23 VAV boxes (no airflow to connected zones).'
    ],
    recommendations: [
      'A mechanical contractor is required to troubleshoot RTU-7.'
    ],
    finalActions: [
      'Station was saved and backed up.'
    ]
  },
  '210965-12939': {
    jobNo: '210965-12939',
    customerName: 'CLIFTON BOARD OF EDUCATION',
    siteName: 'Clifton Early Learner Academy',
    address: '290 Brighton Road, Clifton NJ 07012',
    serviceDate: '03/24/2025',
    technician: 'Rupert Chandool',
    workCompleted: [
      'Communication Check: Logged into Jace and confirmed all devices are communicating.',
      'Checked space temperatures, DAT, and alarms/fault points.',
      'Stroked valves open/close for all units.'
    ],
    issuesFound: [
      'AHU-3: Fail Alarm due to supply fan being off.',
      'AHU-3: Heating valve not supplying hot water → Requires mechanical inspection.',
      'AHU-4: Fail Alarm for return fan & filter.',
      'VAV04: Damper at 0%, but still has flow.',
      'VAV10: Damper at 100%, but no flow.',
      'VAV12, 14: Dampers at 100%, but only small flow.',
      'VAV16, 18, 20: Dampers at 100%, but no flow.',
      'Girl\'s Locker Room: Reheat valve at 0%, but discharge temp at 114°F → Requires mechanical inspection.'
    ],
    recommendations: [
      'Replace CVL4022AS control valve and thermostat.',
      'Mechanical inspection for AHU-3, locker room reheat valve.'
    ],
    finalActions: [
      'Saved and backed up station.'
    ]
  },
  '210972-12946': {
    jobNo: '210972-12946',
    customerName: 'CLIFTON BOARD OF EDUCATION',
    siteName: 'Clifton Early Learner Academy',
    address: '290 Brighton Road, Clifton NJ 07012',
    serviceDate: '04/09/2025',
    technician: 'Rupert Chandool',
    workCompleted: [
      'Performed comprehensive system check of all AHUs and VAV boxes.'
    ],
    issuesFound: [
      'AHU-3: Return fan fail alarm and filter alarm – needs customer/mechanical attention.',
      'AHU-3: Heating valve has a defective part – Honeywell ML7425A3013.',
      'AHU-3: Supply fan bearing is noisy — requires mechanical service.',
      'AHU-1: Disconnect switch not fully engaged.',
      'AHU-4: Requesting cooling, but chillers were not running (ambient temp not at setpoint).',
      'VAV-04, VAV-10, VAV-12, VAV-14, VAV-16, VAV-20: Dampers at 100%, but no box flow.',
      'VAV-18: Setpoint: 72°F, Space temperature: Overheating, Discharge temp: 109°F.',
      'Girl\'s Locker Room: Reheat valve at 0%, yet discharge temp = 94°F – inconsistent behavior.'
    ],
    recommendations: [
      'Replace controller (CVL4022AS) and thermostat for VAV-18.',
      'Replace all defective CVL4022AS controllers and associated thermostats.'
    ],
    finalActions: [
      'Backed up and saved the JACE station.'
    ]
  },
  '210966-12940': {
    jobNo: '210966-12940',
    customerName: 'CLIFTON BOARD OF EDUCATION',
    siteName: 'Clifton High School',
    address: '333 Colfax Avenue, Clifton NJ 07013',
    serviceDate: '03/24/2025',
    technician: 'Richard Bhajan',
    workCompleted: [
      'Met with Bogdan.',
      'Resolved issue with entire 6000 wing that was down.',
      'Used bacnet router to discover the units and reset the Jace to bring all units back online.'
    ],
    issuesFound: [
      'Customer has history of freeze stats issues where freeze stats trip at OAT up to 58 degrees.',
      'Entire 6000 wing was down due to communication issues.'
    ],
    recommendations: [
      'Follow up needed for freeze stats issues - pictures of affected units sent to Vinny.'
    ],
    finalActions: [
      'Email sent to Vinny with issue list.'
    ]
  },
  '210973-12947': {
    jobNo: '210973-12947',
    customerName: 'CLIFTON BOARD OF EDUCATION',
    siteName: 'Clifton High School',
    address: '333 Colfax Avenue, Clifton NJ 07013',
    serviceDate: '04/25/2025',
    technician: 'Rupert Chandool',
    workCompleted: [
      'Met with Bogdan on-site.',
      'Logged into JACE and confirmed successful communication between all devices.',
      'Checked space temperatures, DAT (Discharge Air Temperature), and scanned for any unusual readings, alarms, or fault points.',
      'Stroked valves open and closed for all units to verify operation.'
    ],
    issuesFound: [
      'Heating system was turned off due to the school being unoccupied.',
      'Several fans were found turned off because of asbestos construction in the area.',
      'Multiple UV units had freeze alarms triggered: UVN_311, UVN_309b, UVN_218_Ftr, UVS313_EF, UVE205_EF, UVE207_EF, UVE209_EF, UVE211_EF, UVE305_EF.'
    ],
    recommendations: [
      'D&B was notified to schedule an inspection of the Daikin units for freeze stat issues in the spring.'
    ],
    finalActions: [
      'Noted that an air balancing team was on-site, causing all heating valve bodies to be fully open (100%) during inspection.'
    ]
  },
  '210958-12932': {
    jobNo: '210958-12932',
    customerName: 'CLIFTON BOARD OF EDUCATION',
    siteName: 'Clifton Public School #4',
    address: '194 West 2Nd Street, Clifton NJ 07011',
    serviceDate: '03/21/2025',
    technician: 'Henry Sanchez',
    workCompleted: [
      'Reviewed platform services, daemon output and system log no issues found. Cpu usage at 10%.',
      'Saved station, took a back up. Review alarm panel.'
    ],
    issuesFound: [
      'AC1 in freeze stat alarm.',
      'Freeze stat was set too high at 45 degrees, causing it to trip in warmer conditions, preventing unit from running.'
    ],
    recommendations: [
      'Adjust freeze stat settings to appropriate temperature.'
    ],
    finalActions: [
      'Reset freeze stat and unit runs.'
    ]
  },
  '210968-12942': {
    jobNo: '210968-12942',
    customerName: 'CLIFTON BOARD OF EDUCATION',
    siteName: 'Clifton Public School #11',
    address: '147 Merselis Avenue, Clifton NJ 07011',
    serviceDate: '04/23/2025',
    technician: 'Rupert Chandool',
    workCompleted: [
      'Met with Mateo on-site and logged into JACE.',
      'All devices were online and communicating successfully.',
      'Verified space temperatures, discharge air temps (DAT), and scanned for alarms/fault points.',
      'Stroked valves open/close for all units to confirm proper operation.'
    ],
    issuesFound: [
      'UV_RM01_EF: Unit was off due to odors coming from nearby garbage outside the classroom.',
      'UV_RM09_EF: Offline, requires a new motor.',
      'UV_RM24_EF: Heating valve operational, but valve body is leaking — needs mechanical repair.',
      'All VRVs: Currently offline, scheduled for use starting this summer.',
      'JACE initial backup failed due to 100% CPU usage.'
    ],
    recommendations: [
      'Mechanical repair needed for UV_RM24_EF valve body.',
      'New motor required for UV_RM09_EF.'
    ],
    finalActions: [
      'Made history adjustments, reducing CPU usage to ~23%.',
      'Successfully backed up and saved the station.'
    ]
  },
  '210964-12938': {
    jobNo: '210964-12938',
    customerName: 'CLIFTON BOARD OF EDUCATION',
    siteName: 'Clifton Public School #3',
    address: '365 Washington Avenue, Clifton NJ 07011',
    serviceDate: '03/21/2025',
    technician: 'Henry Sanchez',
    workCompleted: [
      'Reviewed platform services, daemon output and system log no issues found. Cpu usage at 19%.',
      'Saved station, took a back up. Reviewed alarm panel; no major issues found.'
    ],
    issuesFound: [
      'Daikin VRV network is offline.',
      'Ethernet cable that comes from Daikin panel was unplugged.',
      'No one was able to validate why it was unplugged.',
      'Network loss is not affecting units operation.'
    ],
    recommendations: [
      'Reconnect ethernet cable and secure connection.'
    ],
    finalActions: [
      'Network issues documented.'
    ]
  },
  '210961-12935': {
    jobNo: '210961-12935',
    customerName: 'CLIFTON BOARD OF EDUCATION',
    siteName: 'Clifton Public School #9',
    address: '25 Brighton Road, Clifton NJ 07012',
    serviceDate: '03/06/2025',
    technician: 'Rupert Chandool',
    workCompleted: [
      'Logged into Jace to verify communication between all devices – all devices are communicating properly.',
      'Checked space temperatures, discharge air temperature (DAT), and any improper readings.',
      'Reviewed alarms and fault points.',
      'Stroked valves open/close for all units to confirm functionality.',
      'Backed up Jace and saved station for future reference.'
    ],
    issuesFound: [
      'Daikin VRV System – Not yet set up for BMS system integration.',
      'Classroom 210 – Unit was turned off, now brought back online.',
      'Media Room/Library – Overheating due to steam heating from radiant heat.',
      'Room 104 & Room 204 – Low temperatures, especially on very cold days.'
    ],
    recommendations: [
      'Mechanical team needs to inspect Room 104 & Room 204 units.',
      'Complete Daikin VRV integration with BMS.'
    ],
    finalActions: [
      'Brought Classroom 210 unit back online.'
    ]
  },
  '210991-12965': {
    jobNo: '210991-12965',
    customerName: 'CLIFTON BOARD OF EDUCATION',
    siteName: 'Clifton Public School #14',
    address: '99 Saint Andrews Blvd, Clifton NJ 07013',
    serviceDate: '04/30/2025',
    technician: 'Rupert Chandool',
    workCompleted: [
      'Logged into the JACE and verified communication across all devices — all were functioning correctly.',
      'Reviewed space temperatures, discharge air temperatures (DAT), and checked for alarms or fault points.',
      'Stroked valves open and closed for all units to verify operational status.'
    ],
    issuesFound: [
      'Identified high temperatures (~80°F) in Rooms 120, 122, and 124.',
      'VRF system settings needed adjustment for proper cooling.'
    ],
    recommendations: [
      'Update Daikin thermostat settings to appropriate modes for optimal cooling.'
    ],
    finalActions: [
      'Troubleshot the VRF system by reviewing and adjusting settings, ensuring all units were cooling properly.',
      'Updated Daikin thermostat settings to appropriate modes for optimal cooling.',
      'Backed up and saved the station after completing all checks and adjustments.'
    ]
  }
};

// Root cause analysis data 
const rootCauseAnalysis = {
  connectivity: [
    'Network communication failure between BMS and equipment controllers',
    'Controller hardware malfunction or power loss',
    'IP address conflict or network configuration issues',
    'Damaged or loose network connections',
    'Firmware compatibility issues between devices'
  ],
  heating: [
    'Defective valve actuator (Honeywell ML7425A3013)',
    'Valve mechanically stuck in position',
    'Control signal not reaching valve actuator',
    'Hot water supply issues from boiler plant',
    'Incorrect control sequence programming'
  ],
  airflow: [
    'Defective VAV controllers (CVL4022AS)',
    'Mechanical issues with damper linkages or actuators',
    'Flow sensor calibration errors or malfunctions',
    'Ductwork restrictions or obstructions',
    'Pressure sensor failures'
  ],
  mechanical: [
    'Worn bearings in fan assemblies',
    'Belt tension or alignment issues',
    'Motor overload conditions triggering safety shutdowns',
    'Electrical power quality issues affecting motor operation',
    'Inadequate preventative maintenance'
  ],
  system: [
    'Outdated firmware in JACE controllers',
    'Network infrastructure limitations',
    'Configuration mismatches between devices',
    'Station backup and history capacity issues',
    'Security certificate or user permission conflicts'
  ],
  temperature: [
    'Improper freeze stat calibration setting points too high',
    'Sensor placement in areas susceptible to cold spots',
    'Defective or aging temperature sensors',
    'Incorrect freeze protection sequences',
    'Environmental factors affecting outdoor air temperature readings'
  ],
  operational: [
    'Insufficient staff training on HVAC system operation',
    'Manual overrides to address immediate comfort concerns',
    'Lack of clear operational protocols for staff interactions with equipment',
    'Easy accessibility of control switches without security measures',
    'Teachers/staff adjusting systems without understanding systemic impacts'
  ],
  integration: [
    'Incomplete BMS integration of Daikin VRV/VRF systems',
    'Communication protocol mismatches between systems',
    'Disconnected network cables connecting Daikin controllers to BMS',
    'Pending completion of cooling startup configurations',
    'Manufacturer-specific communication limitations'
  ]
};

// Action plan data
const actionPlanData = {
  connectivity: [
    'Perform network diagnostics to identify communication bottlenecks',
    'Check power supply to affected RTU controllers',
    'Verify network addressing and connectivity settings',
    'Schedule mechanical contractor for units requiring hardware intervention'
  ],
  heating: [
    'Order replacement Honeywell ML7425A3013 valve actuators',
    'Schedule mechanical service to replace defective components',
    'Recalibrate valve operation and control signals after replacement',
    'Perform follow-up testing to ensure proper heating operation'
  ],
  airflow: [
    'Verify mechanical operation of dampers before controller replacement',
    'Replace defective CVL4022AS controllers and thermostats',
    'Recalibrate airflow sensors and reset flow parameters',
    'Validate proper operation through staged testing'
  ],
  mechanical: [
    'Inspect fan assemblies for mechanical damage',
    'Replace worn bearings and realign fan components',
    'Check motor amperage and performance metrics',
    'Test operation at various speeds to ensure quiet operation'
  ],
  system: [
    'Update JACE firmware to latest compatible version',
    'Perform network infrastructure assessment',
    'Rebuild device connections and communication pathways',
    'Document updated network architecture for future reference'
  ],
  temperature: [
    'Conduct comprehensive inspection of all freeze stats',
    'Recalibrate freeze stats to appropriate trigger temperatures',
    'Coordinate with D&B for inspection of Daikin units with freeze stat issues',
    'Verify proper sequence operation after calibration',
    'Document proper settings for future reference'
  ],
  operational: [
    'Develop standardized staff training program on proper HVAC system interaction',
    'Consider installation of lockouts on critical equipment controls',
    'Create clear signage indicating which controls should not be adjusted',
    'Implement a system notification process for when adjustments are needed',
    'Document regular custodian procedures for seasonal transitions'
  ],
  integration: [
    'Complete Daikin VRV/VRF integration with BMS before cooling season',
    'Verify all network connections between Daikin systems and building controllers',
    'Update or add missing gateway devices for proper communication',
    'Configure all Daikin thermostats for optimal cooling operation',
    'Test integrated operation of all connected systems'
  ]
};

// Modal component for detailed issue information
const IssueDetailView = ({ issue, onClose }) => {
  // Get related visit logs
  const getRelatedVisits = () => {
    if (!issue.visitRefs || issue.visitRefs.length === 0) {
      return [];
    }
    
    return issue.visitRefs.map(ref => {
      if (visitLogData[ref]) {
        return visitLogData[ref];
      }
      return null;
    }).filter(Boolean);
  };
  
  const relatedVisits = getRelatedVisits();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-black">{issue.title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Issue summary section */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-black mb-2">Issue Description</h4>
            <p className="text-gray-700 mb-3">{issue.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Impact</span>
                <p className="text-gray-800">{issue.impact}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Priority</span>
                <div className="flex items-center">
                  <span className={`px-2 py-1 mt-1 rounded text-xs font-medium 
                    ${issue.priority === 'High' ? 'bg-red-100 text-red-800' : 
                    issue.priority === 'Medium' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'}`}
                  >
                    {issue.priority}
                  </span>
                  <span className="ml-3 text-gray-600">
                    Affecting {issue.frequency} of schools
                  </span>
                </div>
              </div>
            </div>
            
            {issue.affectedEquipment && issue.affectedEquipment.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Affected Equipment</h5>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {issue.affectedEquipment.map((equipment, idx) => (
                    <li key={idx}>{equipment}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Root causes section */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-black mb-2">Root Cause Analysis</h4>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-gray-700 mb-2">Potential causes identified:</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {rootCauseAnalysis[issue.type]?.map((cause, idx) => (
                  <li key={idx}>{cause}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Action plan section */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-black mb-2">Recommended Action Plan</h4>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <div className="flex items-center mb-3">
                <CheckCircle2 size={20} className="text-green-600 mr-2" />
                <p className="text-gray-800 font-medium">{issue.recommendation}</p>
              </div>
              
              <p className="text-gray-700 mb-2">Implementation steps:</p>
              <ol className="list-decimal pl-5 text-gray-700 space-y-1">
                {actionPlanData[issue.type]?.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
          
          {/* Related visits section */}
          {relatedVisits.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-black mb-2">Related Service Visits</h4>
              <div className="space-y-4">
                {relatedVisits.map((visit, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded shadow-sm">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <div>
                        <h5 className="font-medium text-black">{visit.siteName}</h5>
                        <p className="text-sm text-gray-600">{visit.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">{visit.serviceDate}</p>
                        <p className="text-xs text-gray-600">Job #{visit.jobNo}</p>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-gray-700"><strong>Technician:</strong> {visit.technician}</p>
                      
                      {visit.issuesFound && visit.issuesFound.length > 0 && (
                        <div className="mt-3">
                          <h6 className="text-sm font-medium flex items-center text-gray-700">
                            <AlertCircle size={16} className="mr-1 text-amber-500" /> Issues Found:
                          </h6>
                          <ul className="list-disc pl-5 text-sm text-gray-700 mt-1 space-y-1">
                            {visit.issuesFound.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {visit.recommendations && visit.recommendations.length > 0 && (
                        <div className="mt-3">
                          <h6 className="text-sm font-medium flex items-center text-gray-700">
                            <CheckCircle2 size={16} className="mr-1 text-green-600" /> Recommendations:
                          </h6>
                          <ul className="list-disc pl-5 text-sm text-gray-700 mt-1 space-y-1">
                            {visit.recommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end">
                        <button 
                          onClick={() => {
                            // First show the alert
                            alert(`Opening full report for job #${visit.jobNo} in a new window.`);
                            // Then actually open a new window with a mock URL
                            window.open(`https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/service-reports/${visit.jobNo}.pdf`, '_blank');
                          }}
                          className="text-blue-600 text-sm font-medium flex items-center hover:underline"
                        >
                          <FileText size={14} className="mr-1" /> View Full Report
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueDetailView;