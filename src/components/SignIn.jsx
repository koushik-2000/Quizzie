import React, { useRef, useState } from 'react'
import useData from '../context/useData'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {

    const { updateUserData } = useData()
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const [error, setError] = useState()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
     const login = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            if (passwordRef.current?.value && emailRef.current?.value) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/loginUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: emailRef.current.value,
                        password: passwordRef.current.value
                    })
                })
                const data = await response.json();
                if (response.ok) {
                    updateUserData(data.data)
                    navigate('/dashboard')
                    setError('')
                }
                else {
                    setError(data.message)
                }
            }
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <form className='form_container' onSubmit={(e) => login(e)}>
            <div className="row">
                <label>Email</label>
                <input ref={emailRef} className='input_box' type='email' required />
            </div>
            <div className="row">
                <label>Password</label>
                <input ref={passwordRef} className='input_box' minLength={8} type='password' required />
            </div>
            <div className="error">{error}</div>
            <button className='submit_btn' type='submit'>{isLoading ? "Loading.." : "Log In"} </button>
        </form>
    )
}

export default SignIn
