import { track } from '@vercel/analytics';

/**
 * Tracking utility functions for Vercel Analytics
 */

/**
 * Track a page view with additional metadata
 * @param {string} pageName - Name of the page being viewed
 * @param {object} properties - Additional properties to track
 */
export const trackPageView = (pageName, properties = {}) => {
  track('page_view', {
    page_name: pageName,
    ...properties
  });
};

/**
 * Track a specific tab change in the HVAC report
 * @param {string} tabName - Name of the tab that was selected
 */
export const trackTabChange = (tabName) => {
  track('tab_change', {
    tab_name: tabName
  });
};

/**
 * Track when a school is selected on the map
 * @param {string} schoolName - Name of the school that was selected
 * @param {number} schoolId - ID of the school that was selected
 */
export const trackSchoolSelection = (schoolName, schoolId) => {
  track('school_selection', {
    school_name: schoolName,
    school_id: schoolId
  });
};

/**
 * Track when a service report is viewed
 * @param {string} reportId - ID of the report that was viewed
 * @param {string} schoolName - Name of the school the report belongs to
 */
export const trackReportView = (reportId, schoolName) => {
  track('report_view', {
    report_id: reportId,
    school_name: schoolName
  });
};

/**
 * Track filter usage in any component
 * @param {string} filterType - Type of filter used (date, school, issue, etc.)
 * @param {string} filterValue - Value selected for the filter
 */
export const trackFilterUsage = (filterType, filterValue) => {
  track('filter_usage', {
    filter_type: filterType,
    filter_value: filterValue
  });
};
