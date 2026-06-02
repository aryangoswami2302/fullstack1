import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(users.filter(u => u.id !== userId));
        toast.success('User deleted successfully from database');
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error('Failed to delete user');
      }
    }
  };

  const updateUserPlan = async (userId, newPlan) => {
    try {
      await updateDoc(doc(db, 'users', userId), { plan: newPlan });
      setUsers(users.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
      toast.success('User plan updated');
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error('Failed to update plan');
    }
  };

  return { users, loading, deleteUser, updateUserPlan, refreshUsers: fetchUsers };
};
