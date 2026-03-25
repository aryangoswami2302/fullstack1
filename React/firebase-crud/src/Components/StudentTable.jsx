import React, { useEffect, useState } from "react";
import { db } from "../Firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function StudentTable() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const studentCollection = collection(db, "students");

  const getStudents = async () => {
    const data = await getDocs(studentCollection);
    setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getStudents();
  }, []);

  const deleteStudent = async (id) => {
    const studentDoc = doc(db, "students", id);
    await deleteDoc(studentDoc);
    getStudents();
  };

  const editStudent = (student) => {
    navigate("/add", { state: student });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 bg-info">Student List</h2>

      <table className="table table-dark table-hover table-bordered text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>

              <td>
                <button onClick={() => editStudent(student)} className="btn btn-success btn-sm me-2">Edit</button>
                <button onClick={() => deleteStudent(student.id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;