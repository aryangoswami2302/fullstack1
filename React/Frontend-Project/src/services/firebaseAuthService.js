import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { where } from "firebase/firestore";
import { queryDocuments, createMember } from "./firebaseService";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "123456";

export const loginWithFirebase = async ({ email, password }) => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return { email, role: "admin", name: "Admin" };
  }

  const authCredential = await signInWithEmailAndPassword(auth, email, password);
  const userEmail = authCredential.user.email;

  const members = await queryDocuments("members", [where("email", "==", userEmail)]);
  if (members.length > 0) {
    return {
      id: members[0].id,
      email: userEmail,
      role: members[0].role || "member",
      name: members[0].name || userEmail.split("@")[0],
      joinDate: members[0].joinDate || null,
      plan: members[0].plan || "None",
      status: members[0].status || "Inactive",
    };
  }

  const name = userEmail.split("@")[0];
  const joinDate = new Date().toISOString().split("T")[0];
  const fallbackProfile = {
    name,
    email: userEmail,
    role: "member",
    joinDate,
    plan: "None",
    status: "Inactive",
  };

  const createdMember = await createMember(fallbackProfile);
  return { ...fallbackProfile, id: createdMember.id };
};

export const registerWithFirebase = async ({ name, email, password }) => {
  await createUserWithEmailAndPassword(auth, email, password);
  const joinDate = new Date().toISOString().split("T")[0];
  const memberProfile = {
    name,
    email,
    role: "member",
    joinDate,
    plan: "None",
    status: "Inactive",
  };
  const createdMember = await createMember(memberProfile);
  return {
    ...memberProfile,
    id: createdMember.id,
  };
};

export const logoutFromFirebase = async () => {
  await signOut(auth);
};
