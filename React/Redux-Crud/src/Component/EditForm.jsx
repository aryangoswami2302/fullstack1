import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { updatedata } from '../Slice/Userslice'

function EditForm() {

    const redirect = useNavigate()

    const { id } = useParams()
    console.log(id)

    const { users } = useSelector((state) => state.users)
    console.log(users)

    const dispatch = useDispatch()

    const [edited, setedited] = useState({
        id: "",
        name: "",
        email: "",
        gender: "",
        password: ""
    })

  useEffect(() => {
    if (users.length > 0) {
        const singleuser = users.find((data) => data.id == id)
        setedited(singleuser || {})
    }
}, [users, id])
    const getchange = (e) => {
        setedited({
            ...edited,
            [e.target.name]: e.target.value
        })
        console.log(edited)
    }

    const getsubmit = async(e) => {
        e.preventDefault()
        await dispatch(updatedata(edited))
        setedited({
            name: "",
            email: "",
            gender: "",
            password: ""
        })
        redirect("/")
    }

    return (
        <div>
            <h1 className='text-center'>hello this Form Update user </h1>
            <div className="container">
                <div className="row">
                    <div className="col-md-8 mx-auto">
                        <form onSubmit={getsubmit}>
                            <div className="mb-3">
                                <label htmlFor="Name" className="form-label">Enter your Name</label>
                                <input value={edited.name} onChange={getchange} type="text" name='name' className="form-control" id="Name" />

                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                <input value={edited.email} onChange={getchange} type="email" name='email' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div className="mb-3">
                                <div>
                                    <div className="form-check">
                                        <input name="gender" onChange={getchange} checked={edited.gender === "male"} value="male" className="form-check-input" type="radio" id="radioDisabled" />
                                        <label className="form-check-label" htmlFor="radioDisabled">
                                            Male
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input value="female" onChange={getchange} checked={edited.gender === "female"} name='gender' className="form-check-input" type="radio" id="radioCheckedDisabled" />
                                        <label className="form-check-label" htmlFor="radioCheckedDisabled">
                                            Female
                                        </label>
                                    </div>
                                </div>

                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                <input value={edited.password} onChange={getchange} type="password" name='password' className="form-control" id="exampleInputPassword1" />
                            </div>

                            <button type="submit" className="btn btn-primary">Update User</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditForm