import React from 'react'
import '../styles/notfound.css'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div className='notfound_container'>
            <img src="https://cdn.svgator.com/images/2022/01/404-page-animation-example.gif" alt="404" />
            <p>Page Not Found</p>
            <div className="reroute_btn" onClick={() => navigate('/dashboard')}>Route Home</div>
        </div>
    )
}

export default NotFound
