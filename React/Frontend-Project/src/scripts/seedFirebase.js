import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3F91VfXtS2J5keoLj2zqbSz0-zcW-y9w",
  authDomain: "gym-app-eea19.firebaseapp.com",
  projectId: "gym-app-eea19",
  storageBucket: "gym-app-eea19.firebasestorage.app",
  messagingSenderId: "749335661174",
  appId: "1:749335661174:web:40ff07627ee3cabb89ad57",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedPlans = [
  {
    name: "Basic",
    price: "₹29",
    tag: "",
    features: [
      "Access to gym floor",
      "Standard equipment",
      "Locker room access",
      "Free Wi-Fi"
    ]
  },
  {
    name: "Silver",
    price: "₹49",
    tag: "Most Popular",
    features: [
      "All Basic features",
      "Group fitness classes",
      "Cardio machines access",
      "1 Personal training session/mo"
    ]
  },
  {
    name: "Gold",
    price: "₹89",
    tag: "Best Value",
    features: [
      "All Silver features",
      "Unlimited classes",
      "Spa & sauna access",
      "Weekly personal training",
      "Premium guest pass"
    ]
  }
];

const seedMembers = [
  {
    name: "John Doe",
    age: 28,
    plan: "Gold",
    joinDate: "2023-01-15",
    status: "Active",
    email: "john@example.com"
  },
  {
    name: "Jane Smith",
    age: 34,
    plan: "Silver",
    joinDate: "2023-05-20",
    status: "Inactive",
    email: "jane@example.com"
  }
];

async function seed() {
  try {
    // Check if plans already exist
    const plansSnap = await getDocs(query(collection(db, "plans"), limit(1)));
    if (plansSnap.empty) {
      console.log("Seeding plans...");
      for (const plan of seedPlans) {
        await addDoc(collection(db, "plans"), {
          ...plan,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      console.log("Plans seeded!");
    } else {
      console.log("Plans already exist, skipping...");
    }

    // Check if members already exist
    const membersSnap = await getDocs(query(collection(db, "members"), limit(1)));
    if (membersSnap.empty) {
      console.log("Seeding members...");
      for (const member of seedMembers) {
        await addDoc(collection(db, "members"), {
          ...member,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      console.log("Members seeded!");
    } else {
      console.log("Members already exist, skipping...");
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seed();
