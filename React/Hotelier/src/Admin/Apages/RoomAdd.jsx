import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ANavTitle from '../Acomman/ANavTitle'
import Aheader from '../Acomman/Aheader'

function RoomAdd() {

    const redirect = useNavigate()

    const [room, setroom] = useState({
        id: "",
        name: "",
        price: "",
        bed: "",
        bath: "",
        desc: "",
        img: ""
    })

    const getchange = (e) => {
        setroom({
            ...room,
            id: new Date().getTime().toString(),
            [e.target.name]: e.target.value
        })
    }

    const getRoom = async (e) => {

        e.preventDefault()

        try {

            if (
                room.name == "" ||
                room.price == "" ||
                room.bed == "" ||
                room.bath == "" ||
                room.desc == "" ||
                room.img == ""
            ) {
                toast.error("Please fill all fields")
                return
            }

            await axios.post("http://localhost:3000/rooms", room)

            toast.success("Room Successfully Added")

            redirect("/roommanage")

            setroom({
                id: "",
                name: "",
                price: "",
                bed: "",
                bath: "",
                desc: "",
                img: ""
            })

        } catch (error) {
            console.log("API error", error)
        }
    }

    return (
        <div>

            <Aheader />
            <ANavTitle title="RoomAdd" name="RoomAdd" />

            <div className="container py-5">

                <h1 className='text-center mb-4'>Add Room</h1>

                <form onSubmit={getRoom}>

                    <div className="row g-3">

                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    name="name"
                                    value={room.name}
                                    onChange={getchange}
                                    className="form-control"
                                    placeholder="Room Name"
                                />
                                <label>Room Name</label>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    name="price"
                                    value={room.price}
                                    onChange={getchange}
                                    className="form-control"
                                    placeholder="Room Price"
                                />
                                <label>Room Price</label>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    name="bed"
                                    value={room.bed}
                                    onChange={getchange}
                                >
                                    <option hidden>Room Bed</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                                <label>Room Bed</label>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    name="bath"
                                    value={room.bath}
                                    onChange={getchange}
                                >
                                    <option hidden>Room Bath</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                                <label>Room Bath</label>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="form-floating">
                                <input
                                    type="url"
                                    name="img"
                                    value={room.img}
                                    onChange={getchange}
                                    className="form-control"
                                    placeholder="Room Image"
                                />
                                <label>Room Image URL</label>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="form-floating">
                                <textarea
                                    name="desc"
                                    value={room.desc}
                                    onChange={getchange}
                                    className="form-control"
                                    style={{ height: "120px" }}
                                ></textarea>
                                <label>Room Description</label>
                            </div>
                        </div>

                        <div className="col-12">
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                            >
                                Add Room
                            </button>
                        </div>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default RoomAdd