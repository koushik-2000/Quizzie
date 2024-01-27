import React, { useEffect, useState } from 'react'
import '../styles/quiz.css'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { useNavigate } from 'react-router-dom'

const Quiz = () => {
    const [quizData, setQuizData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [startQuiz, setStartQuiz] = useState(false)
    const [currQuestion, setCurrQuestion] = useState(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0)
    const { id } = useParams()
    const navigate = useNavigate()
    const [newData, setNewData] = useState(null)
    const [finalData, setFinalData] = useState([])


    useEffect(() => {
        const fetchQuiz = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/quiz/getQuiz/${id}`, {
                    method: 'GET',
                    header: {
                        'Context-type': 'application/json'
                    }
                })
                if (response.ok) {
                    const data = await response.json()
                    setQuizData(data.data)
                    setIsLoading(false)
                    setCurrQuestion(data.data?.questions[0])
                }
                else {
                    console.log("error")
                    navigate('/notfound')
                }
            }
            catch (err) {
                console.error(err)
                navigate('/notfound')
            }
        }
        fetchQuiz()
    }, [])

    useEffect(() => {
        if (currQuestion?.timer !== 0 && startQuiz) {
            const interval = setInterval(() => {
                changeQuestion()
            }, currQuestion?.timer)
            return () => clearInterval(interval)
        }
        if (newData) {
            setFinalData((prev) => ([...prev, { ...newData }]))
        }
        setNewData(null)
    }, [currQuestion, startQuiz, isCompleted])

    useEffect(() => {
        if (isCompleted && finalData.length === quizData?.questions?.length) {
            console.log({
                ...quizData, impressions: quizData?.impressions + 1, questions: [...finalData]
            })
            updateQuiz()
        }
    }, [finalData])

    const updateQuiz = async () => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/quiz/updateQuiz`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...quizData, impressions: quizData?.impressions + 1, questions: [...finalData]
                })
            })

        } catch (err) {
            console.error(err)
        }
    }

    const changeQuestion = () => {
        if (quizData?.questions?.indexOf(currQuestion) < quizData?.questions?.length - 1) {
            setCurrQuestion(quizData?.questions[quizData?.questions?.indexOf(currQuestion) + 1])
        }
        else {
            setIsCompleted(() => quizData && true)
            setCurrQuestion(null)
        }
    }

    const submitQuiz = () => {
        setIsCompleted(true)
    }

    return (
        <div className='container quiz_container'>
            {
                isLoading ? (
                    <Loading />
                ) : (
                    startQuiz ? (

                        <Question quizData={quizData} setNewData={setNewData} data={currQuestion} changeQuestion={changeQuestion} submitQuiz={submitQuiz} correctAnswerCount={correctAnswerCount} setCorrectAnswerCount={setCorrectAnswerCount} isCompleted={isCompleted} />
                    )
                        : (
                            <StartQuiz setStartQuiz={setStartQuiz} />
                        ))
            }
        </div>
    )
}

const Question = ({ quizData, setNewData, data, changeQuestion, submitQuiz, correctAnswerCount, setCorrectAnswerCount, isCompleted }) => {

    const [timer, setTimer] = useState(null)
    const [answer, setAnswer] = useState(null)
    const [answered, setAnswered] = useState(false)

    useEffect(() => {
        if (data?.timer === 10000) {
            setTimer(9)
        }
        else if (data?.timer === 5000) {
            setTimer(4)
        }
        else {
            setTimer(null)
        }
        setAnswered(false)
        setAnswer(null)
    }, [data])


    const updateData = () => {
        if (answer !== null) {
            setNewData({ ...data, impressions: data?.impressions + 1, options: data?.options.map((option, index) => answer === index ? { ...option, chosen: option.chosen + 1 } : option), correctAnswers: answer === data?.correctOption ? data?.correctAnswers + 1 : 0 })
        }
    }

    useEffect(() => {
        updateData()
        validateAnswer()
    }, [answer])

    const validateAnswer = () => {
        if (answer === data?.correctOption && !answered) {
            setCorrectAnswerCount(prev => prev + 1)
            setAnswered(true)
        }
        if ((answer !== data?.correctOption && answered)) {
            setCorrectAnswerCount(prev => prev - 1)
            setAnswered(false)
        }
    }

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev = prev - 1)
            }, 1000)
            return () => clearInterval(interval);
        }
    }, [timer])

    return (
        !isCompleted ? (
            <div className="quiz_templete">
                <div className="header">
                    <div className="question_no">{String(quizData?.questions?.indexOf(data) + 1).padStart(2, '0')}/
                        {String(quizData?.questions?.length).padStart(2, '0')}</div>
                    {timer > -1 && timer !== null && <div className="timer">00:0{timer}s</div>}
                </div>
                <div className="question">{data?.question}</div>
                <div className="options">
                    {
                        data?.options.map((option, index) => (
                            <div className={`option ${answer === index ? 'choosen' : null} `} style={{ padding: data?.optionType === 'url' ? '' : '1em' }} key={index} onClick={() => setAnswer(index)}>{
                                (data?.optionType === 'text' || data?.optionType === 'text and url') &&
                                <div className='text'>{option.text}</div>
                            }{
                                    (data?.optionType === 'url' || data?.optionType === 'text and url') &&
                                    <div className='image' style={{ overflow: data?.optionType !== 'url' ? 'hidden' : '' }}><img src={option.url} alt='option' /></div>
                                }
                            </div>
                        ))
                    }
                </div>
                {
                    quizData?.questions?.indexOf(data) === quizData?.questions?.length - 1 ? (
                        <div className="next_btn" onClick={() => submitQuiz()}>SUBMIT</div>
                    ) : (
                        <div className="next_btn" onClick={() => changeQuestion()}>NEXT</div>
                    )
                }
            </div>
        ) : (
            <EndOfQuiz quizType={quizData?.quizType} correctAnswerCount={correctAnswerCount} count={quizData?.questions?.length} />
        )
    )

}

const StartQuiz = ({ setStartQuiz }) => {
    return (
        <div className='end_templete'>
            <div className="message">
                Click Start to take the Quiz!
            </div>
            <img src="https://upplabs.com/wp-content/uploads/2020/07/take_quiz_2.png" alt="quiz_start" width={250} />
            <div className='next_btn' onClick={() => setStartQuiz(true)}>Start</div>
        </div>
    )
}

const EndOfQuiz = ({ quizType, correctAnswerCount, count }) => {
    return (
        <div className="end_templete">
            {
                quizType === 'QA' ? (
                    <>
                        <div className="message">
                            Congrats! you completed the Quiz
                        </div>
                        <img src={require('../assets/images/success.png')} alt="success" width={250} />
                        <div className='message'>Your score is <span>{
                            correctAnswerCount > -1 ? (
                                <> {correctAnswerCount.toString().padStart(2, '0')}</>
                            ) : (
                                <>00</>
                            )}/{count.toString().padStart(2, '0')}</span>
                        </div>
                    </>
                ) : (
                    <div className="message">
                        Thank you for participating in the Poll
                    </div>
                )
            }
        </div>
    )
}

export default Quiz
