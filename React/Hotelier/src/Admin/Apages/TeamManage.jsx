import React, { useEffect, useState } from 'react'
import Aheader from '../Acomman/Aheader'
import ANavTitle from '../Acomman/ANavTitle'
import axios from 'axios'
import { toast } from 'react-toastify'

function TeamManage() {

    const [Team, setTeam] = useState([])
    const [editmodel, seteditmodel] = useState(null)
    const [viewData, setViewData] = useState(null)

    const [edited, setedited] = useState({
        id: "",
        name: "",
        img: "",
        Designation: ""
    })

    useEffect(() => {
        fetchdata()
    }, [])

    const fetchdata = async () => {
        try {
            const res = await axios.get("http://localhost:3000/team")
            setTeam(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getModel = (data) => {
        seteditmodel(true)
        setedited(data)
    }

    const getchange = (e) => {
        setedited({
            ...edited,
            [e.target.name]: e.target.value
        })
    }

    const UpdateTeam = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`http://localhost:3000/team/${edited.id}`, edited)
            toast.success("Updated Successfully 🚀")
            fetchdata()
            seteditmodel(null)

            setedited({
                id: "",
                name: "",
                img: "",
                Designation: ""
            })

        } catch (error) {
            toast.error("Update Failed ❌")
        }
    }

    const deleteTeam = async (id) => {
        if (!window.confirm("Are you sure?")) return
        try {
            await axios.delete(`http://localhost:3000/team/${id}`)
            toast.success("Deleted Successfully")
            fetchdata()
        } catch (error) {
            toast.error("Delete Failed")
        }
    }

    return (
        <div>
            <Aheader />
            <ANavTitle title="Team Manage" name="Team Manage" />

            <div className="container">

                <h2 className='my-4 text-center fw-bold'>Team List</h2>

                <table className="table table-hover shadow">
                    <thead className="table-dark">
                        <tr className='text-center'>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            Team.map((data) => (
                                <tr key={data.id} className='text-center align-middle'>
                                    <td>{data.id}</td>

                                    <td>
                                        <img
                                            src={data.img}
                                            width="80"
                                            style={{
                                                borderRadius: "10px",
                                                transition: "0.3s"
                                            }}
                                            onMouseOver={(e) => e.target.style.transform = "scale(1.2)"}
                                            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                                        />
                                    </td>

                                    <td className="fw-bold">{data.name}</td>
                                    <td className="text-muted">{data.Designation}</td>

                                    <td>
                                        <button
                                            className='btn btn-info mx-1'
                                            onClick={() => setViewData(data)}
                                        >
                                            View
                                        </button>

                                        <button
                                            className='btn btn-success mx-1'
                                            onClick={() => getModel(data)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className='btn btn-danger mx-1'
                                            onClick={() => deleteTeam(data.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                {/* 🔥 ROOMMANAGE STYLE VIEW CARD (CENTER POPUP) */}
                {
                    viewData && (
                        <div style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100vh",
                            background: "rgba(0,0,0,0.6)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 999
                        }}>

                            <div className="card shadow-lg border-0"
                                style={{
                                    width: "350px",
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    animation: "fadeIn 0.3s ease-in-out"
                                }}
                            >

                                {/* IMAGE */}
                                <div style={{ overflow: "hidden" }}>
                                    <img
                                        src={viewData.img}
                                        style={{
                                            width: "100%",
                                            height: "250px",
                                            objectFit: "cover",
                                            transition: "0.4s"
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
                                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                                    />
                                </div>

                                {/* CONTENT */}
                                <div className="p-4 text-center">
                                    <h3 className="fw-bold">{viewData.name}</h3>
                                    <p className="text-muted mb-3">{viewData.Designation}</p>

                                    <button
                                        className="btn btn-danger w-100 rounded-pill"
                                        onClick={() => setViewData(null)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                        </div>
                    )
                }

                {/* EDIT FORM */}
                {
                    editmodel && (
                        <div className="container my-5">
                            <div className="card shadow-lg border-0 rounded-4 p-4">

                                <h3 className="text-center mb-4 fw-bold text-success">
                                    ✏️ Edit Team Member
                                </h3>

                                <form onSubmit={UpdateTeam}>
                                    <div className="row g-4">

                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                name="name"
                                                value={edited.name}
                                                onChange={getchange}
                                                placeholder="Enter Name"
                                                className="form-control p-3 rounded-3 shadow-sm"
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                name="Designation"
                                                value={edited.Designation}
                                                onChange={getchange}
                                                placeholder="Enter Designation"
                                                className="form-control p-3 rounded-3 shadow-sm"
                                                required
                                            />
                                        </div>

                                        <div className="col-12">
                                            <input
                                                type="url"
                                                name="img"
                                                value={edited.img}
                                                onChange={getchange}
                                                placeholder="Enter Image URL"
                                                className="form-control p-3 rounded-3 shadow-sm"
                                                required
                                            />
                                        </div>

                                        <div className="col-12 text-center">
                                            <button className="btn btn-success px-5 py-2 rounded-pill shadow-lg mx-2">
                                                Update
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-secondary px-5 py-2 rounded-pill"
                                                onClick={() => seteditmodel(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default TeamManage