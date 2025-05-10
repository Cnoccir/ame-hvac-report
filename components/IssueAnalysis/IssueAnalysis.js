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
  PlusCircle
} from 'lucide-react';
import IssueDetailView from './IssueDetailView';
import SectionTitle from '../ui/SectionTitle';
import SectionSubtitle from '../ui/SectionSubtitle';
import Subheading from '../ui/Subheading';

// Update with all 11 schools data
const schoolIssueData = [
  { name: 'School #1', issues: 3 },
  { name: 'School #4', issues: 5 },
  { name: 'School #8', issues: 2 },
  { name: 'School #11', issues: 1 },
  { name: 'School #12', issues: 4 },
  { name: 'School #13', issues: 2 },
  { name: 'School #14', issues: 3 },
  { name: 'School #15', issues: 1 },
  { name: 'School #17', issues: 2 },
  { name: 'ELA', issues: 7 },
  { name: 'CHS', issues: 4 },
];

// Updated critical issues data with the two new schools
const criticalIssues = [
  {
    id: 1,
    title: 'RTU Communication Failures',
    priority: 'High',
    frequency: '27%',
    schools: 3,
    description: 'Multiple RTUs showing offline status, affecting ventilation and temperature control in connected zones.',
    impact: 'Affects 3 schools (School #17, School #4, School #12)',
    affectedEquipment: ['RTU-7 at School #17 (affects 23 VAV boxes)', 'RTU-3 at School #4', 'RTU-5 at School #12'],
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
    impact: 'Affects 4 schools (ELA, School #1, School #8, School #14)',
    affectedEquipment: ['AHU-3 at ELA', 'AHU-1 at School #1', 'AHU-2 at School #8', 'AHU-4 at School #14'],
    recommendation: 'Replace defective Honeywell ML7425A3013 parts in all affected units.',
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
    impact: 'Most severe at ELA (7 VAVs) and School #12 (5 VAVs)',
    affectedEquipment: ['VAV04, VAV10, VAV12, VAV14, VAV16, VAV18, VAV20 at ELA', 'VAV zones at School #12'],
    recommendation: 'Replace all defective CVL4022AS controllers and associated thermostats.',
    type: 'airflow',
    visitRefs: ['210965-12939', '210972-12946']
  },
  {
    id: 4,
    title: 'AHU Fan Failures',
    priority: 'High',
    frequency: '45%',
    schools: 5,
    description: 'Supply and return fan failures detected across multiple units, causing insufficient air distribution.',
    impact: 'Affects 5 schools (ELA, School #4, School #13, School #14, CHS)',
    affectedEquipment: ['AHU-3 return and supply fans at ELA', 'AHU units at affected schools'],
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
    description: 'JACE system showing communication gaps with certain devices and controllers.',
    impact: 'Affects 3 schools (School #17, School #11, CHS)',
    affectedEquipment: ['JACE controllers at affected schools'],
    recommendation: 'System-wide control network analysis and firmware updates.',
    type: 'system',
    visitRefs: ['211664-13788']
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
                  <button className="w-full flex items-center justify-center bg-gray-50 text-blue-500 border border-gray-200 rounded py-2 px-4 text-sm font-medium hover:bg-gray-100">
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