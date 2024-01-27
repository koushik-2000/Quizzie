import React, { useState } from 'react'
import '../styles/home.css'
import { useNavigate } from 'react-router-dom'
import DashBoard from '../components/DashBoard'
import Analytics from '../components/Analytics'
import CreateQuiz from '../components/CreateQuiz'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [currTab, setCurrTab] = useState('Dashboard')
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('userData')
        localStorage.removeItem('quizData')
        navigate('/')
    }

    const changeTab = () => {
        setCurrTab('Dashboard')
    }

    const Component = () => {
        switch (currTab) {
            case 'Dashboard':
                return <DashBoard updateToast={updateToast} />
            case 'Analytics':
                return <Analytics updateToast={updateToast} />
            case 'Create':
                return <CreateQuiz changeTab={changeTab} updateToast={updateToast} />
            default:
                return <DashBoard />
        }
    }

    const updateToast = (msg) => toast(msg);

    const progressBarCss = {
        background: '#60B84B', // Change this to your desired color
    };

    return (
        <div className='dashboard_container'>
            <div className="left_panel" style={{ transform: showMenu ? 'translateX(0)' : '' }}>
                <h1 className='heading'>QUIZZIE</h1>
                <div className='navigation_tabs'>
                    <div className={`tab ${currTab === 'Dashboard' ? "active" : null}`} onClick={() => { setCurrTab('Dashboard'); setShowMenu(false) }}>DashBoard</div>
                    <div className={`tab ${currTab === 'Analytics' ? "active" : null}`} onClick={() => { setCurrTab('Analytics'); setShowMenu(false) }}>Analytics</div>
                    <div className={`tab ${currTab === 'Create' ? "active" : null}`} onClick={() => { setCurrTab('Create'); setShowMenu(false) }}>Create Quiz</div>
                </div>
                <div className="logout_btn" onClick={() => logout()}>LOGOUT</div>
                <div className="toggler" onClick={() => setShowMenu(prev => !prev)}>
                    <img src={require('../assets/icons/menu.png')} alt="menu" width={30} />
                </div>
            </div>
            <div className="right_panel">
                <Component />
            </div>
            <ToastContainer progressStyle={progressBarCss} />
        </div>
    )
}

export default Home