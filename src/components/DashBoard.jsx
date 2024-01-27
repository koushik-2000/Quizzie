import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useData from '../context/useData'
import CopyToClipboard from 'react-copy-to-clipboard'

const DashBoard = ({ updateToast }) => {
    const { quizData, fetchQuiz } = useData()
    const navigate = useNavigate()
    const [questionCount, setQuestionCount] = useState(0)
    const [impressions, setImpressions] = useState(0)

    useEffect(() => {
        if (!localStorage.getItem('userData')) {
            navigate('/')
        }
        fetchQuiz()
    }, [])

    useEffect(() => {
        if (quizData.length > 0) {
            setQuestionCount(() => {
                let count = 0
                quizData?.map(quiz => count += quiz.questions.length)
                return count;
            })
            setImpressions(() => {
                let count = 0
                quizData?.map(quiz => count += quiz.impressions)
                return count;
            })
        }
    }, [quizData])

    return (
        <div className='sub_container'>
            <div className="row">
                <div className="display">
                    <p>{quizData?.length}</p>
                    <p>Quizzes Created</p>
                </div>
                <div className="display">
                    <p>{questionCount}</p>
                    <p>Questions Created</p>
                </div>
                <div className="display">
                    <p>{impressions}</p>
                    <p>Impressions</p>
                </div>
            </div>
            <div className="row1">
                <h1>Trending Quiz</h1>
                {
                    quizData?.length > 0 ? (
                        <div className='quizzes'>
                            {
                                quizData?.map(quiz =>  quiz.impressions > 10 && (
                                    <CopyToClipboard text={`${process.env.REACT_APP_URL}/#/quiz/${quiz._id}`}>
                                        <div className='quiz_box' key={quiz._id} onClick={() => updateToast('Link copied to clipboard')}>
                                            <div className='header'>
                                                <div className="quiz_name">{quiz.quizName}</div>
                                                <div className="impressions">
                                                    {quiz.impressions}
                                                    <img src={require('../assets/icons/impressions.png')} alt="impressions" />
                                                </div>
                                            </div>
                                            <div className="created_on">Created on : {quiz.createdOn}</div>
                                        </div>
                                    </CopyToClipboard>
                                ))
                            }
                        </div>
                    ) : (
                        <p>You haven't created any Quiz, Click on Create Quiz to create your first Quiz</p>
                    )
                }
            </div>
        </div>
    )
}

export default DashBoard
