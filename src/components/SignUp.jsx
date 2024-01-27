import React, { useRef, useState } from 'react'

const SignUp = ({ setChange }) => {
    const nameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const login = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            if (nameRef.current.value.length < 2) {
                setError('Enter Valid Name')
            }
            else if (passwordRef.current.value !== confirmPasswordRef.current.value) {
                setError('Password did not match')
            }
            else if (passwordRef.current?.value && emailRef.current?.value && nameRef.current?.value) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/newUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userName: nameRef.current.value,
                        email: emailRef.current.value,
                        password: passwordRef.current.value
                    })
                })
                const data = await response.json();
                if (data.status === 'ok') {
                    setChange(true)
                    setError('')
                }
                else {
                    setError(data.message)
                }
            }
            setIsLoading(false)
        }
        catch (err) {
            console.log(err)
        }
    }


    return (
        <form className='form_container' onSubmit={(e) => login(e)}>
            <div className="row">
                <label>Name</label>
                <input ref={nameRef} className='input_box' type='text' required />
            </div>
            <div className="row">
                <label>Email</label>
                <input ref={emailRef} className='input_box' type='email' required />
            </div>
            <div className="row">
                <label>Password</label>
                <input ref={passwordRef} className='input_box' type='password' required />
            </div>
            <div className="row">
                <label>Confirm Password</label>
                <input ref={confirmPasswordRef} className='input_box' type='password' required />
            </div>
            <div className="error">{error}</div>
            <button className='submit_btn' type='submit'>{isLoading ? "Loading.." : "Sign Up"} </button>

        </form>
    )
}

export default SignUp