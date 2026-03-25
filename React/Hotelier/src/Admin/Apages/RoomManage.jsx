import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ANavTitle from '../Acomman/ANavTitle'
import Aheader from '../Acomman/Aheader'
import { toast } from 'react-toastify'

function RoomManage() {

    const [room, setroom] = useState([])
    const [singleRoom, setSingleRoom] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/rooms")
            setroom(res.data)
        } catch (error) {
            console.log("API not found", error)
        }
    }

    const getRooms = async (id) => {
        try {
            const res = await axios.get(`http://localhost:3000/rooms/${id}`)
            setSingleRoom(res.data)
        } catch (error) {
            console.log("Room not found", error)
        }
    }

    const deleteRoom = async (id) => {

        await axios.delete(`http://localhost:3000/rooms/${id}`)

        setroom(room.filter((data) => data.id !== id))

        toast.success("Room Deleted Successfully")

    }

    const getChange = (e) => {

        setSingleRoom({
            ...singleRoom,
            [e.target.name]: e.target.value
        })

    }

    const updateRoom = async (e) => {

        e.preventDefault()

        await axios.put(`http://localhost:3000/rooms/${singleRoom.id}`, singleRoom)

        toast.success("Room Updated Successfully")

        // modal close
        const modal = document.getElementById("editModal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        // refresh table
        fetchData()

    }
    return (
        <div>
            <Aheader />
            <ANavTitle title="RoomManage" name="RoomManage" />

            <div className="container mt-4">

                <h1 className='text-center text-success bg-dark p-2'>
                    Hello this Rooms Manage
                </h1>

                <table className="table table-bordered">

                    <thead>
                        <tr className='text-center'>
                            <th>#id</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Bed</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            room && room.map((data, index) => {

                                return (

                                    <tr key={index} className='text-center'>

                                        <td>{data.id}</td>

                                        <td>
                                            <img
                                                src={data.img}
                                                style={{ width: "100px", borderRadius: "10px" }}
                                                alt=""
                                            />
                                        </td>

                                        <td>{data.name}</td>
                                        <td>{data.bed}</td>

                                        <td>

                                            <button
                                                className='btn btn-primary'
                                                data-bs-toggle="modal"
                                                data-bs-target="#viewModal"
                                                onClick={() => getRooms(data.id)}
                                            >
                                                View
                                            </button>

                                            <button
                                                className='btn btn-success mx-2'
                                                data-bs-toggle="modal"
                                                data-bs-target="#editModal"
                                                onClick={() => getRooms(data.id)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => deleteRoom(data.id)}
                                                className="btn btn-danger"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                )

                            })

                        }

                    </tbody>

                </table>

            </div>


            {/* View Modal */}

            <div className="modal fade" id="viewModal">

                <div className="modal-dialog">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h5 className="modal-title">Room Details</h5>

                            <button className="btn-close" data-bs-dismiss="modal"></button>

                        </div>

                        <div className="modal-body">

                            {singleRoom && (

                                <div className="text-center">

                                    <img
                                        src={singleRoom.img}
                                        style={{ width: "200px", borderRadius: "10px" }}
                                        alt=""
                                    />

                                    <h4 className="mt-3">{singleRoom.name}</h4>

                                    <p><b>Price :</b> {singleRoom.price}</p>

                                    <p><b>Bath :</b> {singleRoom.bath}</p>

                                    <p><b>Bed :</b> {singleRoom.bed}</p>

                                    <p>{singleRoom.desc}</p>

                                    <button className="btn btn-danger" data-bs-dismiss="modal">
                                        Close
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>



            {/* Edit Modal */}

            <div className="modal fade" id="editModal">

                <div className="modal-dialog">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h5 className="modal-title">Edit Room</h5>

                            <button className="btn-close" data-bs-dismiss="modal"></button>

                        </div>

                        <div className="modal-body">

                            {singleRoom && (

                                <form onSubmit={updateRoom}>

                                    <div className="mb-2">

                                        <input
                                            type="text"
                                            name="name"
                                            value={singleRoom.name}
                                            onChange={getChange}
                                            className="form-control"
                                            placeholder="Room Name"
                                        />

                                    </div>

                                    <div className="mb-2">

                                        <input
                                            type="text"
                                            name="price"
                                            value={singleRoom.price}
                                            onChange={getChange}
                                            className="form-control"
                                            placeholder="Price"
                                        />

                                    </div>

                                    <div className="mb-2">

                                        <input
                                            type="text"
                                            name="bed"
                                            value={singleRoom.bed}
                                            onChange={getChange}
                                            className="form-control"
                                            placeholder="Bed"
                                        />

                                    </div>

                                    <div className="mb-2">

                                        <input
                                            type="text"
                                            name="bath"
                                            value={singleRoom.bath}
                                            onChange={getChange}
                                            className="form-control"
                                            placeholder="Bath"
                                        />

                                    </div>

                                    <div className="mb-2">

                                        <input
                                            type="text"
                                            name="img"
                                            value={singleRoom.img}
                                            onChange={getChange}
                                            className="form-control"
                                            placeholder="Image URL"
                                        />

                                    </div>

                                    <div className="mb-2">

                                        <textarea
                                            name="desc"
                                            value={singleRoom.desc}
                                            onChange={getChange}
                                            className="form-control"
                                            placeholder="Description"
                                        />

                                    </div>

                                    <button className="btn btn-primary w-100">
                                        Update Room
                                    </button>

                                </form>

                            )}

                        </div>

                    </div>

                </div>

            </div>


        </div>
    )
}

export default RoomManage