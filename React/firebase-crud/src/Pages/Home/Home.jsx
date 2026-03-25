import React from "react";
import { Link } from "react-router-dom";
import StudentTable from "../../Components/StudentTable";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Student Management</h1>

      <Link to="/add" className="btn btn-primary mb-4">Add Student</Link>

      <StudentTable />
    </div>
  );
}

export default Home;