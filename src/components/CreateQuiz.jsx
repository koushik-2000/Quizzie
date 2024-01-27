import React, { useState } from 'react';
import Modal1 from './Modal1';
import Modal2 from './Modal2';
import Confetti from 'react-confetti'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useData from '../context/useData';



const CreateQuiz = ({ changeTab, updateToast }) => {
    const { userData } = useData()
    const [modal, setModal] = useState(1);

    const currentDate = new Date();

    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(currentDate);
    const formattedDate = `${parts[2].value} ${parts[0].value}, ${parts[4].value}`;

    const [quizData, setQuizData] = useState({
        quizName: '',
        createdBy: userData?._id,
        quizType: null,
        questions: [{}],
        impressions: 0,
        createdOn: formattedDate
    });

    const updateQuizData = (newData) => {
        setQuizData(newData);
    }

    const Modal = () => {
        switch (modal) {
            case 1:
                return <Modal1 changeTab={changeTab} setModal={setModal} quizData={quizData} updateQuizData={updateQuizData} updateToast={updateToast} />;
            case 2:
                return <Modal2 changeTab={changeTab} setModal={setModal} quizData={quizData} updateQuizData={updateQuizData} updateToast={updateToast} />;
            case 3:
                return <Modal3 changeTab={changeTab} setModal={setModal} quizData={quizData} updateToast={updateToast} />;
            default:
                return <Modal1 changeTab={changeTab} setModal={setModal} />;
        }
    }

    return (
        <div className='sub_container'>
            <div className="modal_backdrop">
                <Modal />
                {
                    modal === 3 &&
                    <Confetti className='confetti' />
                }
            </div>
        </div>
    );
};







const Modal3 = ({ changeTab, quizData, updateToast }) => {
    const [link] = useState(`${process.env.REACT_APP_URL}/#/quiz/${quizData._id}` || null)

    return (
        <div className='modal_container2'>
            <div className="modal_overlay" onClick={() => changeTab('Dashboard')}></div>
            <div className='cong_msg'>Congrats your Quiz is Published!</div>
            <div className="link">
                {link ||
                    <p>Loading Link...</p>}
            </div>
            <CopyToClipboard text={link}>
                <div className="share_btn" onClick={() => updateToast('Link Copied to Clipboard')}>Share</div>
            </CopyToClipboard>
        </div >
    )
};

export default CreateQuiz;
