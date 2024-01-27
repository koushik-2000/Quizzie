import React, { useState } from 'react'

const Modal1 = ({ changeTab, setModal, quizData, updateQuizData, updateToast }) => {
    const [name, setName] = useState('')
    const [quizType, setQuizType] = useState('QA')

    const Continue = () => {
        if (name && quizType && name.length > 4) {
            setModal(2)
            updateQuizData({ ...quizData, quizName: name, quizType: quizType })
        }
        else {
            updateToast('Please enter valid Quiz Name')
        }
    }

    return (
        <div className="modal_container">
            <input type="text" placeholder='Quiz name' value={name} onChange={(e) => setName(e.target.value)} />
            <div className="quiz_type">
                <p>Quiz Type</p>
                <div className={`type ${quizType === 'QA' ? 'active' : null}`} onClick={() => setQuizType("QA")}>Q & A</div>
                <div className={`type ${quizType === "Poll" ? 'active' : null}`} onClick={() => setQuizType("Poll")}>
                    Poll Type</div>
            </div>
            <div className="btn_set">
                <div className="btn" onClick={() => changeTab()}>Cancel</div>
                <div className="btn" onClick={() => Continue()}>Continue</div>
            </div>
        </div>
    );
};

export default Modal1