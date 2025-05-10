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
                        <button className="text-blue-600 text-sm font-medium flex items-center hover:underline">
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