// Admin Utilities - Advanced Operations
// આ ફાઈલ Admin Dashboard માટે helpful functions પૂરી પાડે છે

import {
  fetchMembers,
  getMembersByStatus,
  searchMembers,
} from './firebaseService';

// ========== Statistics Functions ==========

export const getMemberStatistics = async () => {
  try {
    const members = await fetchMembers();
    
    const stats = {
      totalMembers: members.length,
      activeMembers: members.filter(m => m.status === 'Active').length,
      inactiveMembers: members.filter(m => m.status === 'Inactive').length,
      planBreakdown: getPlanBreakdown(members),
      averageAge: getAverageAge(members),
      joinedThisMonth: getJoinedThisMonth(members),
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching member statistics:', error);
    throw error;
  }
};

const getPlanBreakdown = (members) => {
  const breakdown = {};
  members.forEach(m => {
    breakdown[m.plan] = (breakdown[m.plan] || 0) + 1;
  });
  return breakdown;
};

const getAverageAge = (members) => {
  if (members.length === 0) return 0;
  const totalAge = members.reduce((sum, m) => sum + parseInt(m.age || 0), 0);
  return Math.round(totalAge / members.length);
};

const getJoinedThisMonth = (members) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return members.filter(m => {
    const joinDate = new Date(m.joinDate);
    return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
  }).length;
};

// ========== Bulk Operations ==========

/**
 * તમામ Active members ને Inactive કરો
 */
export const deactivateAllMembers = async (firebaseService) => {
  try {
    const members = await fetchMembers();
    const activeMembers = members.filter(m => m.status === 'Active');
    
    const promises = activeMembers.map(m =>
      firebaseService.modifyMember(m.id, { status: 'Inactive' })
    );
    
    await Promise.all(promises);
    return activeMembers.length; // કેટલા deactivate થયા
  } catch (error) {
    console.error('Error deactivating members:', error);
    throw error;
  }
};

/**
 * ચોક્કસ plan ના તમામ members ને fetch કરો
 */
export const getMembersByPlan = async (plan) => {
  try {
    const members = await fetchMembers();
    return members.filter(m => m.plan === plan);
  } catch (error) {
    console.error(`Error fetching members by plan: ${plan}`, error);
    throw error;
  }
};

// ========== Data Validation ==========

export const validateMemberData = (memberData) => {
  const errors = [];
  
  if (!memberData.name || memberData.name.trim() === '') {
    errors.push('Name આવશ્યક છે');
  }
  
  if (!memberData.age || memberData.age < 1 || memberData.age > 120) {
    errors.push('Age valid હોવું આવશ્યક છે (1-120)');
  }
  
  if (!memberData.plan || !['Basic', 'Silver', 'Gold'].includes(memberData.plan)) {
    errors.push('Plan valid હોવું આવશ્યક છે');
  }
  
  if (!memberData.status || !['Active', 'Inactive'].includes(memberData.status)) {
    errors.push('Status valid હોવું આવશ્યક છે');
  }
  
  if (memberData.joinDate && isNaN(new Date(memberData.joinDate))) {
    errors.push('Join date valid હોવું આવશ્યક છે');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ========== Export Functions ==========

/**
 * JSON format માં export કરો
 */
export const exportToJSON = async () => {
  try {
    const members = await fetchMembers();
    const dataStr = JSON.stringify(members, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    downloadFile(dataBlob, 'members.json');
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw error;
  }
};

/**
 * CSV format માં export કરો
 */
export const exportToCSV = async () => {
  try {
    const members = await fetchMembers();
    
    const headers = ['ID', 'Name', 'Age', 'Plan', 'Status', 'Join Date'];
    const rows = members.map(m => [
      m.id,
      m.name,
      m.age,
      m.plan,
      m.status,
      m.joinDate
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(csvBlob, 'members.csv');
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

const downloadFile = (blob, filename) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ========== Reporting ==========

/**
 * Members Report બનાવો
 */
export const generateMembersReport = async () => {
  try {
    const members = await fetchMembers();
    const stats = await getMemberStatistics();
    
    const report = {
      generatedAt: new Date().toISOString(),
      summary: stats,
      details: members.map(m => ({
        ...m,
        ageGroup: getAgeGroup(m.age)
      }))
    };
    
    return report;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

const getAgeGroup = (age) => {
  age = parseInt(age);
  if (age < 20) return '< 20';
  if (age < 30) return '20-29';
  if (age < 40) return '30-39';
  if (age < 50) return '40-49';
  return '50+';
};

// ========== Search & Filter ==========

/**
 * Advanced search - multiple criteria
 */
export const advancedSearch = async (filters) => {
  try {
    let members = await fetchMembers();
    
    if (filters.name) {
      members = members.filter(m => 
        m.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.status) {
      members = members.filter(m => m.status === filters.status);
    }
    
    if (filters.plan) {
      members = members.filter(m => m.plan === filters.plan);
    }
    
    if (filters.minAge) {
      members = members.filter(m => parseInt(m.age) >= parseInt(filters.minAge));
    }
    
    if (filters.maxAge) {
      members = members.filter(m => parseInt(m.age) <= parseInt(filters.maxAge));
    }
    
    return members;
  } catch (error) {
    console.error('Error in advanced search:', error);
    throw error;
  }
};

// ========== Data Backup & Restore ==========

/**
 * Database backup લો
 */
export const backupDatabase = async () => {
  try {
    const members = await fetchMembers();
    const backup = {
      timestamp: new Date().toISOString(),
      collections: {
        members: members
      }
    };
    
    const backupStr = JSON.stringify(backup, null, 2);
    const backupBlob = new Blob([backupStr], { type: 'application/json' });
    downloadFile(backupBlob, `backup-${Date.now()}.json`);
    
    return backup;
  } catch (error) {
    console.error('Error backing up database:', error);
    throw error;
  }
};

export default {
  getMemberStatistics,
  deactivateAllMembers,
  getMembersByPlan,
  validateMemberData,
  exportToJSON,
  exportToCSV,
  generateMembersReport,
  advancedSearch,
  backupDatabase
};
