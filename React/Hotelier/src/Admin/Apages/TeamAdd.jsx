import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Aheader from '../Acomman/Aheader'
import ANavTitle from '../Acomman/ANavTitle'

function TeamAdd() {

    const redirect = useNavigate()

    const [team, setteam] = useState({
        id: "",
        name: "",
        img: "",
        Designation: ""
    })

    const getchage = (e) => {
        setteam({
            ...team,
            id: new Date().getTime().toString(),
            [e.target.name]: e.target.value
        })
        console.log(team)
    }

    const GetTeam = async (e) => {
        e.preventDefault()

        try {

            if (team.Designation == "" || team.img == "" || team.name == "") {
                toast.error("Pls Enter Details")
                return false
            }

            const res = await axios.post("http://localhost:3000/team",)
            console.log(res.data)
            toast.success("team Add Successfully")
            setteam({
                name: "",
                img: "",
                Designation: ""
            })
            redirect("/teamManage")

        } catch (error) {
            console.log("Api data not found", error)
            toast.error("Api data not Found")
        }
    }

    return (
        <div>
            <Aheader />
            <ANavTitle title="Team Add" name="Team Add"/>
            <div className="container py-5">
                <h1>Hello this Team Add</h1>
                <div className="row">
                    <div className="col-md-12">
                        <div className="wow fadeInUp" data-wow-delay="0.2s">
                            <form onSubmit={GetTeam}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input name='name' value={team.name} onChange={getchage} type="text" className="form-control" id="name" placeholder="Team Name" />
                                            <label htmlFor="name">Team Name</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input type="text" name='Designation' onChange={getchage} value={team.Designation} className="form-control" id="TeamDesignation" placeholder="Team Designation" />
                                            <label htmlFor="Team Designation">Team Designation</label>
                                        </div>
                                    </div>


                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input type="url" name='img' onChange={getchage} value={team.img} className="form-control" id="img" placeholder="Team Image" />
                                            <label htmlFor="img">Team Image</label>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <button className="btn btn-primary w-100 py-3" type="submit">Add Team</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamAdd