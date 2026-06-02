// Firebase Integration Examples
// આ ફાઈલ વિવિધ scenarios માં Firebase વાપરવાનું ઉદાહરણ આપે છે

// ========== Example 1: Simple Member Operations ==========

import { 
  fetchMembers, 
  createMember, 
  modifyMember, 
  removeMember 
} from '@/services/firebaseService';

/**
 * Example: Member CRUD operations
 */
export const memberOperationsExample = async () => {
  // 1. સર્વ members fetch કરો
  const members = await fetchMembers();
  console.log('All members:', members);

  // 2. નવો member બનાવો
  const newMember = await createMember({
    name: 'રાજીવ પટેલ',
    age: 30,
    plan: 'Gold',
    status: 'Active',
    joinDate: '2024-04-28'
  });
  console.log('Created member:', newMember);

  // 3. Member update કરો
  const updatedMember = await modifyMember(newMember.id, {
    status: 'Inactive',
    plan: 'Silver'
  });
  console.log('Updated member:', updatedMember);

  // 4. Member delete કરો
  const deletedId = await removeMember(newMember.id);
  console.log('Deleted member ID:', deletedId);
};

// ========== Example 2: Real-time Updates (Hook Pattern) ==========

import { useState, useEffect } from 'react';
import { subscribeToCollection } from '@/services/firebaseService';

/**
 * Real-time members hook
 */
export const useRealtimeMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // Set up real-time listener
    const unsubscribe = subscribeToCollection('members', (data) => {
      setMembers(data);
      setLoading(false);
    });

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  return { members, loading, error };
};

// Usage in component:
// const { members, loading } = useRealtimeMembers();

// ========== Example 3: Batch Operations ==========

import { api } from '@/services/api';

/**
 * તમામ members ને ચોક્કસ status માં બદલો
 */
export const updateAllMembersStatus = async (newStatus) => {
  try {
    const members = await fetchMembers();
    const updatePromises = members.map(member =>
      api.updateMember(member.id, { status: newStatus })
    );
    
    const results = await Promise.all(updatePromises);
    console.log(`${results.length} members updated to ${newStatus}`);
    return results;
  } catch (error) {
    console.error('Error updating members:', error);
    throw error;
  }
};

// ========== Example 4: Filtering & Search ==========

/**
 * ચોક્કસ conditions પર members filter કરો
 */
export const filterMembers = async (filterCriteria) => {
  const members = await fetchMembers();
  
  return members.filter(member => {
    if (filterCriteria.name && 
        !member.name.toLowerCase().includes(filterCriteria.name.toLowerCase())) {
      return false;
    }
    
    if (filterCriteria.status && member.status !== filterCriteria.status) {
      return false;
    }
    
    if (filterCriteria.plan && member.plan !== filterCriteria.plan) {
      return false;
    }
    
    if (filterCriteria.minAge && parseInt(member.age) < filterCriteria.minAge) {
      return false;
    }
    
    if (filterCriteria.maxAge && parseInt(member.age) > filterCriteria.maxAge) {
      return false;
    }
    
    return true;
  });
};

// Usage:
// const results = await filterMembers({ status: 'Active', plan: 'Gold' });

// ========== Example 5: Admin Dashboard Integration ==========

import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers as reduxFetchMembers } from '@/store/membersSlice';

/**
 * Redux-based member management (existing setup)
 */
export const AdminDashboardIntegration = () => {
  const dispatch = useDispatch();
  const { list: members, loading } = useSelector(state => state.members);

  useEffect(() => {
    // Redux automatically uses Firebase API
    dispatch(reduxFetchMembers());
  }, [dispatch]);

  // members આપમેળે Firebase પાસે load થશે
  return members;
};

// ========== Example 6: Error Handling ==========

/**
 * Try-catch pattern with proper error handling
 */
export const createMemberWithErrorHandling = async (memberData) => {
  try {
    // Validate data
    if (!memberData.name || !memberData.age) {
      throw new Error('Name અને Age આવશ્યક છે');
    }

    // Create member
    const newMember = await createMember(memberData);
    console.log('Member created successfully:', newMember);
    
    return { success: true, data: newMember };
  } catch (error) {
    console.error('Failed to create member:', error);
    
    // Different error types
    if (error.message.includes('آvश્યક')) {
      return { success: false, error: 'Validation failed' };
    } else if (error.code === 'permission-denied') {
      return { success: false, error: 'Permission denied' };
    } else {
      return { success: false, error: error.message };
    }
  }
};

// ========== Example 7: Aggregations & Reports ==========

/**
 * Members પર statistics કલેક્ટ કરો
 */
export const getMembersAnalytics = async () => {
  const members = await fetchMembers();

  const analytics = {
    total: members.length,
    active: members.filter(m => m.status === 'Active').length,
    inactive: members.filter(m => m.status === 'Inactive').length,
    byPlan: {
      basic: members.filter(m => m.plan === 'Basic').length,
      silver: members.filter(m => m.plan === 'Silver').length,
      gold: members.filter(m => m.plan === 'Gold').length,
    },
    averageAge: Math.round(
      members.reduce((sum, m) => sum + parseInt(m.age), 0) / members.length
    ),
    youngestMember: members.reduce((min, m) => 
      parseInt(m.age) < parseInt(min.age) ? m : min
    ),
    oldestMember: members.reduce((max, m) => 
      parseInt(m.age) > parseInt(max.age) ? m : max
    ),
  };

  return analytics;
};

// ========== Example 8: Performance Optimization ==========

import { useMemo } from 'react';

/**
 * Memo કર્તા filtering performance optimize કરો
 */
export const OptimizedMemberList = ({ members, searchTerm }) => {
  const filteredMembers = useMemo(() => {
    return members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  return filteredMembers;
};

// ========== Example 9: Complex Queries ==========

/**
 * Multiple conditions સાથે query
 */
export const getElitePremiumMembers = async () => {
  const members = await fetchMembers();
  
  return members.filter(m => 
    m.status === 'Active' && 
    m.plan === 'Gold' &&
    parseInt(m.age) >= 25 &&
    parseInt(m.age) <= 50
  );
};

// ========== Example 10: Testing Firebase Functions ==========

/**
 * Testing function - Firebase સાથે connection check કરવા માટે
 */
export const testFirebaseConnection = async () => {
  try {
    const testData = {
      name: 'Test User',
      age: 25,
      plan: 'Basic',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    };

    // Create
    const created = await createMember(testData);
    console.log('✓ Create successful:', created);

    // Update
    const updated = await modifyMember(created.id, { status: 'Inactive' });
    console.log('✓ Update successful:', updated);

    // Read
    const members = await fetchMembers();
    console.log('✓ Read successful, total members:', members.length);

    // Delete
    const deleted = await removeMember(created.id);
    console.log('✓ Delete successful:', deleted);

    return { success: true, message: 'Firebase connection test passed!' };
  } catch (error) {
    console.error('✗ Firebase connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Usage: Call કરો browser console માં
// testFirebaseConnection().then(result => console.log(result));

export default {
  memberOperationsExample,
  useRealtimeMembers,
  updateAllMembersStatus,
  filterMembers,
  createMemberWithErrorHandling,
  getMembersAnalytics,
  OptimizedMemberList,
  getElitePremiumMembers,
  testFirebaseConnection
};
