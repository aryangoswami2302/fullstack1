import React, { useState } from 'react'
import { adddata } from '../Slice/Userslice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function UserAdd() {

    const redirect = useNavigate()
    const dispatch = useDispatch()

    const [form, setform] = useState({
        id: "",
        name: "",
        email: "",
        gender: "",
        password: ""
    })

    const getchange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const submitdata = (e) => {
        e.preventDefault()

        const newUser = {
            ...form,
            id: new Date().getTime().toString()
        }

        dispatch(adddata(newUser))

        setform({
            id: "",
            name: "",
            email: "",
            gender: "",
            password: ""
        })

        redirect("/")
    }

    return (
        <div>
            <h1 className='text-center'>hello this Form data user </h1>
            <div className="container">
                <div className="row">
                    <div className="col-md-8 mx-auto">
                        <form onSubmit={submitdata}>

                            <div className="mb-3">
                                <label className="form-label">Enter your Name</label>
                                <input
                                    type="text"
                                    name='name'
                                    onChange={getchange}
                                    value={form.name}
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email address</label>
                                <input
                                    type="email"
                                    name='email'
                                    onChange={getchange}
                                    value={form.email}
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">

                                <div className="form-check">
                                    <input
                                        name="gender"
                                        value="male"
                                        checked={form.gender === "male"}
                                        onChange={getchange}
                                        className="form-check-input"
                                        type="radio"
                                    />
                                    <label className="form-check-label">Male</label>
                                </div>

                                <div className="form-check">
                                    <input
                                        name="gender"
                                        value="female"
                                        checked={form.gender === "female"}
                                        onChange={getchange}
                                        className="form-check-input"
                                        type="radio"
                                    />
                                    <label className="form-check-label">Female</label>
                                </div>

                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name='password'
                                    onChange={getchange}
                                    value={form.password}
                                    className="form-control"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Add User
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAdd