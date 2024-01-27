import React, { useEffect, useState } from 'react'

const Options = ({ quizData, currQuestion, questions, setCurrQuestion }) => {
    const [options, setOptions] = useState([])

    useEffect(() => {
        setOptions([...currQuestion.options])
    }, [currQuestion.options.length, currQuestion.id])


    const handleTextChange = (index, value, type) => {
        setOptions((prev) => {
            const updatedOptions = [...prev];
            updatedOptions[index][type] = value;
            return updatedOptions
        });
        setCurrQuestion({ ...currQuestion, options: [...options] })
    };

    const removeOption = (index) => {
        const newOptions = currQuestion.options.filter((_, ind) => ind !== index)
        setCurrQuestion({ ...currQuestion, options: [...newOptions] })
    }

    switch (currQuestion?.optionType) {
        case "text":
            return currQuestion?.options.map((option, index) => (
                <div key={index} className='option'>
                    {
                        quizData?.quizType === 'QA' &&
                        <input
                            type="radio"
                            name="ansOption"
                            checked={currQuestion.correctOption === index}
                            onChange={() => setCurrQuestion({ ...currQuestion, correctOption: index })}
                        />
                    }
                    <input
                        type="text"
                        className={`${currQuestion.correctOption === index ? 'active' : null}`}
                        placeholder="Text"
                        value={options[index]?.text || ''}
                        onChange={(e) => handleTextChange(index, e.target.value, "text")}
                    />
                    {
                        index > 1 &&
                        <img src={require('../assets/icons/delete.png')} alt='delete' width={18} height={18} onClick={() => removeOption(index)} />
                    }
                </div>
            ));

        case "url":
            return currQuestion?.options.map((option, index) => (
                <div key={index} className='option'>
                    {
                        quizData?.quizType === 'QA' &&
                        <input type="radio" name="ansOption" checked={currQuestion.correctOption === index} onChange={() => setCurrQuestion({ ...currQuestion, correctOption: index })} />
                    }
                    <input
                        type="text" className={`${currQuestion.correctOption === index ? 'active' : null}`} placeholder="Image Url"
                        value={options[index]?.url || ''}
                        onChange={(e) => handleTextChange(index, e.target.value, "url")}
                    />
                </div>
            ));
        case "text and url":
            return currQuestion?.options.map((option, index) => (
                <div key={index} className='option'>
                    {
                        quizData?.quizType === 'QA' &&
                        <input
                            type="radio"
                            name="ansOption"
                            checked={currQuestion.correctOption === index}
                            onChange={() => setCurrQuestion({ ...currQuestion, correctOption: index })}
                        />
                    }
                    <input
                        type="text"
                        className={`${currQuestion.correctOption === index ? 'active' : null}`}
                        placeholder="Text"
                        value={options[index]?.text || ''}
                        onChange={(e) => handleTextChange(index, e.target.value, "text")}
                    />
                    <input
                        type="text"
                        className={`${currQuestion.correctOption === index ? 'active' : null}`}
                        placeholder="Image Url"
                        value={options[index]?.url || ""}
                        onChange={(e) => handleTextChange(index, e.target.value, "url")}
                    />
                </div>
            ));
        default:
            return currQuestion?.options.map((option, index) => (
                <div key={index} className='option'>
                    <input type="radio" name="ansOption" />
                    <input type="text" placeholder="Option" value="" />
                </div>
            ));
    }
};

export default Options