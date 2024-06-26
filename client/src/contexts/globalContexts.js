import React, {useState, useContext} from 'react';
import axios from 'axios';


const BASE_URL = 'http://localhost:5001/api/v1/';

const GlobalContext = React.createContext();


export const GlobalProvider = ({ children }) => {

    const [incomes, setIncome] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${BASE_URL}add-income`, income, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // handle successful response if needed
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    return (
        <GlobalContext.Provider value={
            {
                addIncome,
            }
        }>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}