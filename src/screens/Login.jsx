import React, { useEffect, useState } from 'react'
import '../styles/login.css'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [change, setChange] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem('userData')) {
            navigate('/Dashboard')
        }
    }, [])

    return (
        <div className="login_container">
            <div className="login_box">
                <h1 className='heading'>QUIZZIE</h1>
                <div className='btn_set'>
                    <div className={`btn ${change ? null : "active"}`} onClick={() => setChange(false)} >Sign Up</div>
                    <div className={`btn ${change ? "active" : null}`} onClick={() => setChange(true)} >Log In</div>
                </div>
                {
                    change ? (
                        <SignIn />
                    ) :
                        (
                            <SignUp setChange={setChange} />
                        )
                }
            </div>
        </div>
    )
}

export default Login