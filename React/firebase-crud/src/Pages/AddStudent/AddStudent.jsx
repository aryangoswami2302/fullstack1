import React, { useState, useEffect } from "react";
import { db } from "../../Firebase/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

function AddStudent() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const studentCollection = collection(db, "students");

  useEffect(() => {
    if (location.state) {
      const student = location.state;
      setName(student.name);
      setAge(student.age);
      setCourse(student.course);
      setEditId(student.id);
    }
  }, []);

  const handleSubmit = async () => {
    if (editId) {
      const studentDoc = doc(db, "students", editId);
      await updateDoc(studentDoc, { name, age, course });
    } else {
      await addDoc(studentCollection, { name, age, course });
    }
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow" style={{ width: "400px", margin: "auto" }}>
        <h3 className="text-center mb-4">
          {editId ? "Update Student" : "Add Student"}
        </h3>

        <input type="text" className="form-control mb-3" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />

        <input type="number" className="form-control mb-3" placeholder="Enter Age" value={age} onChange={(e) => setAge(e.target.value)} />

        <input type="text" className="form-control mb-3" placeholder="Enter Course" value={course} onChange={(e) => setCourse(e.target.value)} />

        <button onClick={handleSubmit} className={`btn ${editId ? "btn-success" : "btn-dark"} w-100`}>{editId ? "Update Data" : "Add Data"}</button>
      </div>
    </div>
  );
}

export default AddStudent;