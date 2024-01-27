import React, { useEffect, useState } from 'react';
import useData from '../context/useData'
import '../styles/analytics.css'
import Loading from './Loading'
import CopyToClipboard from 'react-copy-to-clipboard';

const Analytics = ({ updateToast }) => {
    const { quizData, isLoading, fetchQuiz } = useData()
    const [currQuiz, setCurrQuiz] = useState(null)
    const [quizId, setQuizId] = useState(null)
    const [modal, setModal] = useState(null)

    return (
        <>
            {
                currQuiz ? (
                    modal === 1 ? (
                        <Analysis currQuiz={currQuiz} setCurrQuiz={setCurrQuiz} />
                    ) :
                        (
                            <Edit currQuiz={currQuiz} setCurrQuiz={setCurrQuiz} />
                        )
                ) : (
                    <div className='sub_container'>
                        <h1 className='heading2'>Quiz Analysis</h1>
                        {
                            isLoading ? (
                                <Loading />
                            ) : (
                                <>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Quiz Name</th>
                                                <th>Created On</th>
                                                <th>Impressions</th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                quizData.map((quiz, index) => (
                                                    <tr key={quiz._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{quiz.quizName}</td>
                                                        <td>{quiz.createdOn}</td>
                                                        <td>{quiz.impressions}</td>
                                                        <td>
                                                            <img
                                                                src={require('../assets/icons/edit.png')}
                                                                alt="edit"
                                                                width={15}
                                                                onClick={() => { setCurrQuiz(quiz); setModal(2) }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <img
                                                                src={require('../assets/icons/delete.png')}
                                                                alt="delete"
                                                                width={15}
                                                                onClick={() => setQuizId(quiz._id)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <CopyToClipboard text={`${process.env.REACT_APP_URL}/#/quiz/${quiz._id}`}>
                                                                <img
                                                                    src={require('../assets/icons/share.png')}
                                                                    alt="share"
                                                                    width={15}
                                                                    onClick={() => updateToast('Link Copied to Clipboard')}
                                                                />
                                                            </CopyToClipboard>
                                                        </td>
                                                        <td>
                                                            <div
                                                                className='link'
                                                                onClick={() => { setCurrQuiz(quiz); setModal(1) }}
                                                            >
                                                                Question Wise Analysis
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </>
                            )
                        }
                    </div>
                )
            }
            {
                quizId && <DeleteModal setQuizId={setQuizId} quizId={quizId} />
            }
            <div className='reload_btn' onClick={() => fetchQuiz()}>
                <img src="https://icons.veryicon.com/png/o/miscellaneous/common-icons-9/146-loading.png" alt="loader" width={30} />
            </div>
        </>
    )
}

const Analysis = ({ currQuiz, setCurrQuiz }) => {

    return (
        <div className='sub_container1'>
            <div className="header">
                <h1 className='heading1'>{currQuiz.quizName} Question Analysis</h1>
                <div className="quiz_data">
                    <div className="created_on">Created on : {currQuiz?.createdOn}</div>
                    <div className="impressions">Impressions : {currQuiz?.impressions}</div>
                </div>
            </div>
            <div className="quiz_questions">
                {
                    currQuiz?.questions.map((question, index) => (
                        <div className='question_container'>
                            <div className="question">Q.{index + 1} {question.question}</div>
                            <div className="question_data">
                                {
                                    currQuiz.quizType === 'QA' ? (
                                        <>
                                            <div className="attempted">
                                                <p>{question.impressions}</p>
                                                <p>people Attempted the question</p>
                                            </div>
                                            <div className="correct_answers">
                                                <p>{question.correctAnswers}</p>
                                                <p>people Answered Correctly</p>
                                            </div>
                                            <div className="incorrect_answers">
                                                <p>{question.impressions - question.correctAnswers}</p>
                                                <p>people Answered Incorrectly</p>
                                            </div>
                                        </>
                                    ) : (
                                        question.options.map((option, index) => (
                                            <div className='chosen_answer' key={index}>
                                                <p>{option.chosen}</p>
                                                <p>Option {index + 1}</p>
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="back_btn" onClick={() => setCurrQuiz(null)}>Back</div>
        </div>
    )
}

const Edit = ({ currQuiz, setCurrQuiz }) => {
    const [data, setData] = useState(currQuiz)
    const [modal, setModal] = useState(false)

    const currentDate = new Date();

    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(currentDate);
    const formattedDate = `${parts[2].value} ${parts[0].value}, ${parts[4].value}`;

    useEffect(() => {
        setData({
            ...data,
            questions: data.questions.map((q) => (
                { ...q, impressions: 0 }
            )),
            impressions: 0,
            createdOn: formattedDate
        })
    }, [])

    const updateQuestion = (index, value, type) => {
        setData({
            ...data,
            questions: data.questions.map((q, ind) => (
                ind === index ? { ...q, [type]: value } : q
            )),
        })
    }

    const updateOption = (index, oIndex, text, url) => {
        setData({
            ...data,
            questions: data.questions.map((q, ind) => (
                ind === index ? {
                    ...q, options: q.options.map((opt, i) => (
                        oIndex === i ? { text: text ? text : opt.text, url: url ? url : opt.url } : opt
                    ))
                } : q
            ))
        })
    }

    const deleteOption = (index, oind) => {
        setData({
            ...data,
            questions: data.questions.map((q, ind) => (
                ind === index ? { ...q, options: q.options.filter((_, oin) => oin !== oind) } : q
            ))
        })
    }

    const addOption = (index) => {
        setData({
            ...data,
            questions: data.questions.map((q, ind) => (
                ind === index ? { ...q, options: [...q.options, { text: "", url: "" }] } : q
            ))
        })
    }


    return (

        <div className='sub_container1'>
            <div className="header">
                <h1 className='heading1'>Edit Quiz</h1>
                <div className="quiz_data">
                    <div className="created_on">Created on : {data?.createdOn}</div>
                    <div className="impressions">Impressions : {data?.impressions}</div>
                </div>
            </div>
            <div className="quiz_questions">
                {
                    data?.questions.map((question, index) => (
                        <div className='question_container1'>
                            <div className="question">Q.{index + 1} {question?.question}</div>
                            <div className="question_data">
                                <input type='text' className='question_input' placeholder='Enter question' value={question?.question} onChange={(e) => updateQuestion(index, e.target.value, 'question')} />
                                <h1>Option Type:</h1>
                                <div className='option_type'>
                                    <div>
                                        <input type='radio' id={question._id + '1'} name={question._id} value="text" checked={question?.optionType === "text"} onChange={(e) => updateQuestion(index, e.target.value, 'optionType')} />
                                        <label htmlFor={question._id + '1'}>Text</label>
                                    </div>
                                    <div>
                                        <input type='radio' id={question._id + '2'} name='option_type' value="url" checked={question?.optionType === 'url'} onChange={(e) => updateQuestion(index, e.target.value, 'optionType')} />
                                        <label htmlFor={question._id + '2'}>Url</label>
                                    </div>
                                    <div>
                                        <input type='radio' id={question._id + '3'} name='option_type' value="text and url" checked={question?.optionType === 'text and url'} onChange={(e) => updateQuestion(index, e.target.value, 'optionType')} />
                                        <label htmlFor={question._id + '3'}>Text and Url</label>
                                    </div>
                                </div>
                                <h1>Options: </h1>
                                <div className='options'>
                                    {
                                        question.options.map((option, ind) => (
                                            <>
                                                <div className='option'>
                                                    {
                                                        currQuiz.quizType === 'QA' &&
                                                        <input type='radio' checked={question.correctOption === ind} onChange={() => updateQuestion(index, ind, 'correctOption')} />
                                                    }
                                                    {(question.optionType === 'text' || question.optionType === 'text and url') &&
                                                        <input type='text' className={` ${question.correctOption === ind ? 'correct' : ''}`} placeholder='text' value={option.text} onChange={(e) => updateOption(index, ind, e.target.value, null)} />
                                                    }
                                                    {(question.optionType === 'url' || question.optionType === 'text and url') &&
                                                        <input type='text' className={` ${question.correctOption === ind ? 'correct' : ''}`} placeholder='image url' value={option.url} onChange={(e) => updateOption(index, ind, null, e.target.value)} />
                                                    }
                                                    {
                                                        ind > 1 &&
                                                        <img src={require('../assets/icons/delete.png')} alt="delete" width={15} onClick={() => deleteOption(index, ind)} />
                                                    }
                                                </div>
                                            </>
                                        ))
                                    }
                                    {
                                        question.options.length < 4 &&
                                        <div className='add_btn' onClick={() => addOption(index)} style={{ marginLeft: data.quizType === 'QA' ? '30px' : '' }}>Add option</div>
                                    }
                                </div>
                                {
                                    currQuiz.quizType === 'QA' &&
                                    <>
                                        <h1>Timer :</h1>
                                        <div className='timer_type1'>
                                            {question.timerType}
                                            <div className={`timer ${question.timer === 0 ? 'active' : ''}`} onClick={() => updateQuestion(index, 0, 'timer')}>
                                                off
                                            </div>
                                            <div className={`timer ${question.timer === 5000 ? 'active' : ''}`} onClick={() => updateQuestion(index, 5000, 'timer')}>
                                                5 sec
                                            </div>
                                            <div className={`timer ${question.timer === 10000 ? 'active' : ''}`} onClick={() => updateQuestion(index, 10000, 'timer')}>
                                                10 sec
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="btn_set">
                <div className="update_btn" onClick={() => setModal(true)}>Update Quiz</div>
                <div className="back_btn" onClick={() => setCurrQuiz(null)}>Cancel</div>
            </div>
            {
                modal && <UpdateModal quiz={data} setModal={setModal} setCurrQuiz={setCurrQuiz} />
            }
        </div>
    )
}

const DeleteModal = ({ setQuizId, quizId }) => {
    const { fetchQuiz } = useData()
    const deleteQuiz = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/quiz/deleteQuiz/${quizId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await response.json()
            if (response.ok) {
                setQuizId(null)
                fetchQuiz()
            }
        } catch (err) {
            console.error(err)
        }
    }
    return <div className="modal_backdrop">
        <div className="modal_container2">
            <div className="modal_overlay" onClick={() => setQuizId(null)}></div>
            <div className='cong_msg'>Are you sure you want to delete?</div>
            <div className="btn_set">
                <div className="btn" onClick={() => setQuizId(null)}>Cancel</div>
                <div className="btn" style={{ background: '#FF4B4B' }} onClick={() => deleteQuiz()}>Confirm</div>
            </div>
        </div>

    </div>
}

const UpdateModal = ({ quiz, setModal, setCurrQuiz }) => {
    const { fetchQuiz } = useData()
    const updateQuiz = async () => {
        if (quiz) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/quiz/updateQuiz`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(quiz),
                })
                const data = await response.json()
                if (data.status === 'ok') {
                    setCurrQuiz(null)
                    fetchQuiz()
                }
            }
            catch (err) {
                console.error(err)
            }
        }
    }
    return (
        <div className="modal_backdrop">
            <div className="modal_container2">
                <div className="modal_overlay" onClick={() => { }}></div>
                <div className='cong_msg'>Are you sure you want to update?</div>
                <div className="btn_set">
                    <div className="btn" onClick={() => setModal(false)}>Cancel</div>
                    <div className="btn" style={{ background: '#008011' }} onClick={() => updateQuiz()}>Confirm</div>
                </div>
            </div>

        </div>
    )
}

export default Analytics
