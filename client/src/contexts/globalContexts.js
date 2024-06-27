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
        getIncome()
    };

    const getIncome = async () => {
        const response = await axios.get(`${BASE_URL}get-income`)
        setIncome(response.data)
        console.log(`TESTING2 🚨🅿️`)
        console.log(response.data)
    }

   const deleteIncome = async (id) => {
        try {
            const response = await axios.delete((`${BASE_URL}delete-income/${id}`))
            console.log(response.data)
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
        getIncome()
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach(income => {
            totalIncome += income.amount
        })
        return totalIncome
    }

   console.log( 'total 🏦:', totalIncome())

    return (
        <GlobalContext.Provider value={
            {
                addIncome,
                getIncome,
                incomes,
                deleteIncome,
                totalIncome,
            }
        }>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}