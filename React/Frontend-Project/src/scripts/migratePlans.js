// 🚀 FIREBASE MIGRATION SCRIPT
// Browser Console માં આ entire code paste કરો અને run કરો
// આ script db.json માંથી plans data Firebase માં add કરશે

async function migratePlansToFirebase() {
  // Firestore imports
  const { getFirestore, collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
  
  // તમારા Firebase instance
  import { db } from './src/firebase.js';
  
  const plans = [
    {
      id: "1",
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
      id: "2",
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
      id: "3",
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

  try {
    console.log('🔄 Starting migration...');
    
    const plansRef = collection(db, 'plans');
    let count = 0;

    for (const plan of plans) {
      await addDoc(plansRef, {
        name: plan.name,
        price: plan.price,
        tag: plan.tag,
        features: plan.features,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      count++;
      console.log(`✓ Added: ${plan.name}`);
    }

    console.log(`✅ Migration complete! ${count} plans added to Firebase`);
    return { success: true, count };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return { success: false, error: error.message };
  }
}

// Run the migration
migratePlansToFirebase();
