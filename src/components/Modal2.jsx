import React, { useEffect, useState } from 'react'
import Options from './Options';
import useData from '../context/useData';

const Modal2 = ({ changeTab, setModal, quizData, updateQuizData, updateToast }) => {
    const { fetchQuiz } = useData()
    const [questions, setQuestions] = useState([
        {
            id: Math.floor(Math.random() * 1000000),
            question: "",
            optionType: "text",
            options: [{ text: "", url: "", chosen: 0 }, { text: "", url: "", chosen: 0 }],
            timer: 0,
            correctOption: null,
        },
    ]);
    const [currQuestion, setCurrQuestion] = useState({ ...questions[0] });

    useEffect(() => {
        setQuestions((prev) => {
            return prev.map((oldQuestion) => {
                if (oldQuestion.id === currQuestion.id) {
                    return currQuestion;
                }
                return oldQuestion;
            });
        });
    }, [currQuestion])



    const addQuestion = () => {
        setQuestions([...questions, {
            id: Math.floor(Math.random() * 1000000),
            question: "",
            impressions: 0,
            optionType: 'text',
            timer: 0,
            options: [{ text: "", url: "", chosen: 0 }, { text: "", url: "", chosen: 0 }],
            correctOption: null,
            correctAnswers: 0
        }]);
    };

    useEffect(() => {
        setCurrQuestion({ ...questions[questions.length - 1] })
    }, [questions?.length])

    const removeQuestion = (index) => {
        setCurrQuestion(() => questions[0])
        if (questions.length > 1) {
            const updatedQuestions = questions.filter((_, ind) => index !== ind);
            setQuestions(updatedQuestions);
        } else {
            console.log("cant perform operation");
        }
    };

    const changeQuestion = (question) => {
        if (currQuestion.id !== question.id) {
            setCurrQuestion(() => question);
            setQuestions((prev) => {
                return prev.map((oldQuestion) => {
                    if (oldQuestion.id === currQuestion.id) {
                        return currQuestion;
                    }
                    return oldQuestion;
                });
            });
        }
    };

    const addOption = () => {
        if (currQuestion.options.length < 4) {
            setCurrQuestion({ ...currQuestion, options: [...currQuestion.options, { text: "", url: "" }] })
        }
    }

    const createQuiz = async () => {
        for (const question of questions) {
            if (question.question === "") {
                updateToast("Please enter a valid question");
                return;
            }
            for (const option of question.options) {
                if ((question.optionType === "text" && option.text === "") || (question.optionType === "url" && option.url === "") || (question.optionType === "text" && option.text === "" && question.optionType === "url" && option.url === "")) {
                    updateToast("Please enter a valid option");
                    return;
                }
            }
            if (question.correctOption === null && quizData.quizType === 'QA') {
                updateToast("Please enter a correct option");
                return;
            }
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/quiz/createQuiz`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ ...quizData, questions: [...questions] })
            })
            const data = await response.json()
            updateQuizData(data.data)
            fetchQuiz()
        }
        catch (err) {
            console.error(err)
        }
        setModal(3);
    };


    return (
        <div className="modal_container1">
            <div className="questions">
                {
                    questions.map((question, index) =>
                        <div className={`question ${question.id === currQuestion.id ? 'active' : null}`} key={index} onClick={() => changeQuestion(question)}>
                            {index + 1}
                            {
                                index > 0 &&
                                <div className="close_btn" onClick={() => removeQuestion(index)}>x</div>
                            }
                        </div>
                    )
                }{
                    questions.length < 5 &&
                    <div className="question new_question" onClick={() => addQuestion()}>+</div>
                }
                {/* <div className='tip'>Max 5 Questions</div> */}
            </div>
            <input type="text" placeholder={`${quizData.quizType === 'Poll' ? 'Poll' : ''} Question`} value={currQuestion?.question} onChange={(e) => setCurrQuestion({ ...currQuestion, question: e.target.value })} />
            <div className="quiz_type">
                <h1>Option Type</h1>
                <div>
                    <input type="radio" id="text" name="option_type" value="text" checked={currQuestion.optionType === "text"} onChange={(e) => setCurrQuestion({ ...currQuestion, optionType: e.target.value })} />
                    <label htmlFor="text">Text</label>
                </div>
                <div>
                    <input type="radio" id="url" name="option_type" value="url" checked={currQuestion.optionType === "url"} onChange={(e) => setCurrQuestion({ ...currQuestion, optionType: e.target.value })} />
                    <label htmlFor="url">Image URL</label>
                </div>
                <div>
                    <input type="radio" id="textandurl" name="option_type" value="text and url" checked={currQuestion.optionType === "text and url"} onChange={(e) => setCurrQuestion({ ...currQuestion, optionType: e.target.value })} />
                    <label htmlFor="textandurl">Text and Image URL</label>
                </div>
            </div>
            <div className='row2'>
                <div className="questions">
                    <Options quizData={quizData} currQuestion={currQuestion} questions={questions} setCurrQuestion={setCurrQuestion} />
                    {
                        currQuestion.options.length < 4 &&
                        <div className="addOptionBtn" style={{ marginLeft: quizData.quizType === 'QA' ? '30px' : '' }} onClick={() => addOption()}>Add option</div>
                    }
                </div>
                {
                    quizData.quizType === 'QA' &&
                    <div className="timer_type">
                        <h1>Timer</h1>
                        <div className={`timer_value ${currQuestion.timer === 5000 ? 'active' : null}`} onClick={() => setCurrQuestion({
                            ...currQuestion, timer: 5000
                        })}>5 sec</div>
                        <div className={`timer_value ${currQuestion.timer === 10000 ? 'active' : null}`} onClick={() => setCurrQuestion({
                            ...currQuestion, timer: 10000
                        })}>10 sec</div>
                        <div className={`timer_value ${currQuestion.timer === 0 ? 'active' : null}`} onClick={() => setCurrQuestion({
                            ...currQuestion, timer: 0
                        })}>OFF</div>
                    </div>
                }
            </div>
            <div className="btn_set">
                <div className="btn" onClick={() => changeTab()}>Cancel</div>
                <div className="btn" onClick={() => createQuiz()}>Create Quiz</div>
            </div>
        </div >
    );
};

export default Modal2