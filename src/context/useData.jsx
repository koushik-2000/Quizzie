import { createContext, useContext, useState } from "react";

const UserContext = createContext(null)

export const DataProvider = ({ children }) => {
    const [userData, setUserData] = useState(() => {
        const storedData = localStorage.getItem("userData");
        return storedData ? JSON.parse(storedData) : null;
    })
    const [quizData, setQuizData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchQuiz = async () => {
        setIsLoading(true)
        try {
            const createdBy = userData?._id;
            const response = await fetch(`${process.env.REACT_APP_API_URL}/quiz/fetchQuiz/${createdBy}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json()
            if (data.status === 'ok') {
                setQuizData(data?.data)
                localStorage.setItem('quizData', JSON.stringify(data.data))
            }
            else {
                setQuizData([])
                localStorage.setItem('quizData', JSON.stringify([]))
                console.log(data.message)
            }
            setIsLoading(false)

        } catch (err) {
            console.error(err)
        }
    }

    const updateUserData = (newData) => {
        setUserData(newData)
        localStorage.setItem('userData', JSON.stringify(newData))
    }

    return (
        <UserContext.Provider value={{ userData, quizData, updateUserData, fetchQuiz, isLoading }}>
            {children}
        </UserContext.Provider>
    )
}

const useData = () => {
    return useContext(UserContext)
}

export default useData