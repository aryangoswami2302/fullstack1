import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

// ========== Generic Helper Functions ==========
export const getCollection = async (colName) => {
  try {
    const snap = await getDocs(collection(db, colName));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error(`Error fetching collection ${colName}:`, error);
    throw error;
  }
};

export const addDocument = async (colName, payload) => {
  try {
    const ref = await addDoc(collection(db, colName), {
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: ref.id, ...payload, createdAt: new Date(), updatedAt: new Date() };
  } catch (error) {
    console.error(`Error adding document to ${colName}:`, error);
    throw error;
  }
};

export const updateDocument = async (colName, docId, payload) => {
  try {
    const docRef = doc(db, colName, docId);
    await updateDoc(docRef, {
      ...payload,
      updatedAt: new Date()
    });
    return { id: docId, ...payload, updatedAt: new Date() };
  } catch (error) {
    console.error(`Error updating document in ${colName}:`, error);
    throw error;
  }
};

export const deleteDocument = async (colName, docId) => {
  try {
    const docRef = doc(db, colName, docId);
    await deleteDoc(docRef);
    return docId;
  } catch (error) {
    console.error(`Error deleting document from ${colName}:`, error);
    throw error;
  }
};

// ========== Real-time Listener (Optional - for live updates) ==========
export const subscribeToCollection = (colName, callback) => {
  try {
    const unsubscribe = onSnapshot(collection(db, colName), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(data);
    });
    return unsubscribe;
  } catch (error) {
    console.error(`Error subscribing to ${colName}:`, error);
    throw error;
  }
};

// ========== Query Helpers ==========
export const queryDocuments = async (colName, conditions) => {
  try {
    let q = query(collection(db, colName));
    
    if (conditions && conditions.length > 0) {
      q = query(collection(db, colName), ...conditions);
    }
    
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error(`Error querying ${colName}:`, error);
    throw error;
  }
};

// ========== Member Specific API ==========
export const fetchMembers = async () => {
  try {
    return await getCollection("members");
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

export const createMember = async (member) => {
  try {
    return await addDocument("members", member);
  } catch (error) {
    console.error("Error creating member:", error);
    throw error;
  }
};

export const modifyMember = async (id, data) => {
  try {
    return await updateDocument("members", id, data);
  } catch (error) {
    console.error("Error modifying member:", error);
    throw error;
  }
};

export const removeMember = async (id) => {
  try {
    return await deleteDocument("members", id);
  } catch (error) {
    console.error("Error removing member:", error);
    throw error;
  }
};

// ========== Plans Specific API ==========
export const fetchPlans = async () => {
  try {
    return await getCollection("plans");
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
};

export const createPlan = async (plan) => {
  try {
    return await addDocument("plans", plan);
  } catch (error) {
    console.error("Error creating plan:", error);
    throw error;
  }
};

export const modifyPlan = async (id, data) => {
  try {
    return await updateDocument("plans", id, data);
  } catch (error) {
    console.error("Error modifying plan:", error);
    throw error;
  }
};

export const removePlan = async (id) => {
  try {
    return await deleteDocument("plans", id);
  } catch (error) {
    console.error("Error removing plan:", error);
    throw error;
  }
};

// ========== Payments Specific API ==========
export const fetchPayments = async () => {
  try {
    return await getCollection("payments");
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const createPayment = async (payment) => {
  try {
    return await addDocument("payments", payment);
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const modifyPayment = async (id, data) => {
  try {
    return await updateDocument("payments", id, data);
  } catch (error) {
    console.error("Error modifying payment:", error);
    throw error;
  }
};

export const removePayment = async (id) => {
  try {
    return await deleteDocument("payments", id);
  } catch (error) {
    console.error("Error removing payment:", error);
    throw error;
  }
};

// ========== Search & Filter Helpers ==========
export const searchMembers = async (searchTerm) => {
  try {
    const members = await fetchMembers();
    return members.filter(m => 
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.plan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching members:", error);
    throw error;
  }
};

export const getMembersByStatus = async (status) => {
  try {
    const members = await fetchMembers();
    return members.filter(m => m.status === status);
  } catch (error) {
    console.error("Error getting members by status:", error);
    throw error;
  }
};
