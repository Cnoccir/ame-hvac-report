import React, { useState } from 'react';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { 
  AlertTriangle, 
  Thermometer, 
  Fan, 
  AirVent, 
  Activity,
  HardDrive,
  PlusCircle,
  WifiOff,
  Power
} from 'lucide-react';
import IssueDetailView from './IssueDetailView';
import SectionTitle from '../ui/SectionTitle';
import SectionSubtitle from '../ui/SectionSubtitle';
import Subheading from '../ui/Subheading';

// Data for all 11 schools with accurate names
const schoolIssueData = [
  { name: 'PS #1', issues: 3 },
  { name: 'PS #3', issues: 2 },
  { name: 'PS #4', issues: 2 },
  { name: 'PS #5', issues: 3 },
  { name: 'PS #9', issues: 4 },
  { name: 'PS #11', issues: 5 },
  { name: 'PS #14', issues: 3 },
  { name: 'PS #17', issues: 2 },
  { name: 'Early Learner Academy', issues: 7 },
  { name: 'High School', issues: 9 },
  { name: 'Stadium Weight Room', issues: 1 },
];

// Updated critical issues data with accurate school names and all identified issues
const criticalIssues = [
  {
    id: 1,
    title: 'RTU Communication Failures',
    priority: 'High',
    frequency: '27%',
    schools: 3,
    description: 'Multiple RTUs showing offline status, affecting ventilation and temperature control in connected zones.',
    impact: 'Affects 3 schools (PS #17, PS #3, PS #1)',
    affectedEquipment: ['RTU-7 at PS #17 (affects 23 VAV boxes)', 'RTU-2 at PS #3 (Auditorium)', 'RTU-1, RTU-2, RTU-3 fan status issues at PS #1'],
    recommendation: 'Schedule immediate mechanical contractor inspection for all affected units.',
    type: 'connectivity',
    visitRefs: ['211664-13788']
  },
  {
    id: 2,
    title: 'AHU Heating Valve Defects',
    priority: 'High',
    frequency: '36%',
    schools: 4,
    description: 'Heating valves not supplying hot water, causing temperature control issues in multiple zones.',
    impact: 'Affects 4 schools (Early Learner Academy, PS #11, High School, PS #14)',
    affectedEquipment: ['AHU-3 at Early Learner Academy (defective Honeywell ML7425A3013)', 'UV_RM24_EF at PS #11 (valve body leaking)', 'UV_C313_EF at High School', 'HWS Pump 2 at PS #14'],
    recommendation: 'Replace defective Honeywell ML7425A3013 parts and inspect valve bodies for leaks.',
    type: 'heating',
    visitRefs: ['210965-12939', '210972-12946']
  },
  {
    id: 3,
    title: 'VAV Damper Flow Issues',
    priority: 'Medium',
    frequency: '18%',
    schools: 2,
    description: 'Multiple VAV boxes showing dampers at 100% with minimal or no airflow to zones.',
    impact: 'Most severe at Early Learner Academy (7 VAVs)',
    affectedEquipment: ['VAV04, VAV10, VAV12, VAV14, VAV16, VAV18, VAV20 at Early Learner Academy'],
    recommendation: 'Replace all defective CVL4022AS controllers and associated thermostats.',
    type: 'airflow',
    visitRefs: ['210965-12939', '210972-12946']
  },
  {
    id: 4,
    title: 'AHU Fan Failures',
    priority: 'High',
    frequency: '36%',
    schools: 4,
    description: 'Supply and return fan failures detected across multiple units, causing insufficient air distribution.',
    impact: 'Affects 4 schools (Early Learner Academy, PS #11, High School, PS #4)',
    affectedEquipment: ['AHU-3 return and supply fans at Early Learner Academy', 'UV_RM09_EF at PS #11 (needs new motor)', 'UV fans at High School', 'AC-1 at PS #4'],
    recommendation: 'Comprehensive mechanical service for bearing replacement and fan alignment.',
    type: 'mechanical',
    visitRefs: ['210972-12946']
  },
  {
    id: 5,
    title: 'JACE System Management',
    priority: 'Medium',
    frequency: '27%',
    schools: 3,
    description: 'JACE system showing communication gaps with certain devices and controllers. PS #11 experienced 100% CPU usage.',
    impact: 'Affects 3 schools (PS #17, PS #11, High School)',
    affectedEquipment: ['JACE controllers at affected schools'],
    recommendation: 'System-wide control network analysis and firmware updates.',
    type: 'system',
    visitRefs: ['211664-13788', '210968-12942']
  },
  {
    id: 6,
    title: 'Freeze Stat Problems',
    priority: 'High',
    frequency: '36%',
    schools: 4,
    description: 'Units tripping at abnormally warm temperatures (up to 58°F), causing system shutdowns.',
    impact: 'Most severe at High School (multiple UV units). Also affects PS #4 (AC1 freeze stat set too high).',
    affectedEquipment: ['Multiple UV units at High School (UVN_311, UVN_309b, UVN_218_Ftr, UVS313_EF, UVE205_EF, UVE207_EF, UVE209_EF, UVE211_EF, UVE305_EF)', 'AC1 at PS #4'],
    recommendation: 'Comprehensive inspection and recalibration of all freeze stats. D&B to schedule Daikin unit inspection.',
    type: 'temperature',
    visitRefs: ['210966-12940', '210973-12947', '210958-12932']
  },
  {
    id: 7,
    title: 'Manual System Overrides',
    priority: 'Medium',
    frequency: '64%',
    schools: 7,
    description: 'Units manually deactivated or placed in inappropriate modes by staff, affecting system performance.',
    impact: 'Widespread issue across 7 schools (PS #4, PS #5, PS #9, PS #11, PS #14, PS #1, Stadium Weight Room)',
    affectedEquipment: ['UV15_EF15 at PS #4', 'UV-Rm104 and UV-Rm6-Art-EF at PS #5', 'UV_RM204 at PS #9', 'UV_RM01_EF, UV_RM02_EF at PS #11', 'UV lights in rooms 123 and 125 at PS #14', 'Boilers at PS #1 and PS #9'],
    recommendation: 'Staff education program and consideration of control lockouts to prevent unauthorized changes.',
    type: 'operational',
    visitRefs: ['210976-12950', '210959-12933', '210979-12953', '210957-12931', '210969-12943', '210978-12952']
  },
  {
    id: 8,
    title: 'Daikin VRV/VRF Integration',
    priority: 'High',
    frequency: '45%',
    schools: 5,
    description: 'Daikin VRV/VRF systems not properly integrated with BMS or showing offline status.',
    impact: 'Affects 5 schools (PS #9, PS #11, PS #3, PS #1, PS #14)',
    affectedEquipment: ['Daikin VRV System at PS #9 (not yet set up for BMS integration)', 'VRVs at PS #11 (offline until summer)', 'Daikin VRV network at PS #3 (ethernet cable unplugged)', 'Daikin D-BACS at PS #1 (offline)', 'VRF system at PS #14 (high temperatures in rooms)'],
    recommendation: 'Accelerated Daikin integration project before peak cooling season.',
    type: 'integration',
    visitRefs: ['210961-12935', '210957-12931', '210964-12938', '210978-12952', '210991-12965']
  }
];

// Component for the issue type icon
const IssueTypeIcon = ({ type }) => {
  switch (type) {
    case 'connectivity':
      return <HardDrive size={20} />;
    case 'heating':
      return <Thermometer size={20} />;
    case 'airflow':
      return <AirVent size={20} />;
    case 'mechanical':
      return <Fan size={20} />;
    case 'system':
      return <Activity size={20} />;
    case 'temperature':
      return <Thermometer size={20} />;
    case 'operational':
      return <AlertTriangle size={20} />;
    case 'integration':
      return <HardDrive size={20} />;
    default:
      return <AlertTriangle size={20} />;
  }
};

// Main IssueAnalysis component
const IssueAnalysis = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
  };

  const handleCloseDetail = () => {
    setSelectedIssue(null);
  };

  // Calculate total issues across all schools
  const totalIssues = schoolIssueData.reduce((sum, school) => sum + school.issues, 0);

  return (
    <div>
      <SectionTitle>ANALYSIS OF RECURRING ISSUES</SectionTitle>
      <SectionSubtitle />

      {/* Visual overview chart */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <Subheading>Issue Distribution by School</Subheading>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={schoolIssueData}
              margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={60} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                label={{ value: 'Number of Issues', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} 
              />
              <Tooltip 
                formatter={(value) => [`${value} issue${value !== 1 ? 's' : ''}`, 'Issue Count']}
                labelFormatter={(label) => `School: ${label}`}
              />
              <Legend />
              <Bar dataKey="issues" name="Issues Reported" fill="#E83A3A" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary statistics */}
        <div className="flex justify-around mt-4 text-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">11</div>
            <div className="text-sm text-gray-600">Schools</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{totalIssues}</div>
            <div className="text-sm text-gray-600">Total Issues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{criticalIssues.length}</div>
            <div className="text-sm text-gray-600">Critical Categories</div>
          </div>
        </div>
      </div>

      {/* Critical issues section */}
      <div className="mb-6">
        <Subheading>Critical Issues by Priority</Subheading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalIssues.map((issue) => (
            <div 
              key={issue.id} 
              className={`border-l-4 rounded-lg shadow bg-white overflow-hidden border border-gray-200 hover:shadow-md transition-shadow
                ${issue.priority === 'High' ? 'border-l-red' :
                  issue.priority === 'Medium' ? 'border-l-gray-500' : 'border-l-gray-400'}`}
              onClick={() => handleIssueSelect(issue)}
            >
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-md mr-3 
                    ${issue.type === 'connectivity' ? 'bg-blue-100 text-blue-600' : 
                     issue.type === 'heating' ? 'bg-red-100 text-red-600' :
                     issue.type === 'airflow' ? 'bg-cyan-100 text-cyan-600' :
                     issue.type === 'mechanical' ? 'bg-purple-100 text-purple-600' :
                     'bg-green-100 text-green-600'}`}
                  >
                    <IssueTypeIcon type={issue.type} />
                  </div>
                  <h5 className="font-semibold text-black">{issue.title}</h5>
                </div>
                
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs px-2 py-1 rounded font-medium
                    ${issue.priority === 'High' ? 'bg-red-100 text-red-800' :
                      issue.priority === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {issue.priority} Priority
                  </span>
                  <span className="text-xs text-gray-600">
                    {issue.frequency} ({issue.schools} schools)
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  {issue.description}
                </p>
                
                <div className="text-sm text-gray-700 mb-2">
                  <strong>Impact:</strong> {issue.impact}
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-700 font-medium mb-3">
                    <strong>Recommendation:</strong> {issue.recommendation}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the parent div's onClick from firing
                      handleIssueSelect(issue);
                    }}
                    className="w-full flex items-center justify-center bg-gray-50 text-blue-500 border border-gray-200 rounded py-2 px-4 text-sm font-medium hover:bg-gray-100"
                  >
                    View Details <PlusCircle size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issue detail modal */}
      {selectedIssue && (
        <IssueDetailView 
          issue={selectedIssue} 
          onClose={handleCloseDetail} 
        />
      )}
    </div>
  );
};

export default IssueAnalysis;