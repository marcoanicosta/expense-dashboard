import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';



const BASE_URL = 'http://localhost:5001/api/v1/';

const GlobalContext = React.createContext();


export const GlobalProvider = ({ children }) => {

    const [incomes, setIncome] = useState([])
    const [expenses, setExpenses] = useState([])
    const [accounts, setAccounts] = useState([])
    const [items, setItems] = useState([])
    const [upcomingTransactions, setUpcomingTransactions] = useState([]);
    const [error, setError] = useState(null)

    // Income functions 🛰️
    const addIncome = async (income) => {
        try { 
            const response = await axios.post(`${BASE_URL}add-income`, income, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // Optionally, handle the successful response here if needed
            console.log('Income added successfully:', response.data);
    
            // Call getIncome to refresh the income list after adding a new income
            getIncome();
            console.log(`GET 👷🏾: OUTERCALL🚨🅿️`)
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    };
    const getIncome = async () => {
        const response = await axios.get(`${BASE_URL}get-income`)
        setIncome(response.data)
        console.log(`GET 👷🏾: 🚨🅿️`)
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
    
    // Expense functions 🛰️
    const addExpense = async (expenseData) => {
        try {
            const response = await axios.post(`${BASE_URL}add-expense`, expenseData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Expense added successfully:', response.data);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };
    const getExpenses = async () => {
        const response = await axios.get(`${BASE_URL}get-expense`)
        setExpenses(response.data)
        console.log(response.data)
        await getAccounts()
    }
    const deleteExpense = async (id) => {
        try {
            const response  = await axios.delete((`${BASE_URL}delete-expense/${id}`))
            console.log(response.data)
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
        getExpenses()
    }
    const totalExpenses = () => {
        let totalIncome = 0;
        expenses.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }


    // Account functions 🛰️
    const addAccount = async (account) => {
        const response = await axios.post(`${BASE_URL}add-account`, account)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getAccounts()
    }
    const getAccounts = async () => {
        const response = await axios.get(`${BASE_URL}get-account`)
        setAccounts(response.data)
        console.log("TESSSSSSTTTTT3 🚨🅿️", response.data)
    }
    const deleteAccount = async (id) => {
        const res  = await axios.delete(`${BASE_URL}delete-account/${id}`)
        getAccounts()
    }

    // Item functions 🛰️
    const addItem = async (item) => {
        try {
            const response = await axios.post(`${BASE_URL}add-item`, item, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Item added successfully:', response.data);
            getItems(); // ✅ this is the correct refresh call
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    }
    const getItems = async () => {
        const response = await axios.get(`${BASE_URL}get-item`)
        setItems(response.data)
        await getAccounts()
    }
    const deleteItem = async (id) => {
        const res  = await axios.delete(`${BASE_URL}delete-item/${id}`)
        getItems()
    }


    const handleAssignAccount = async (itemId, accountId) => {
        try {
          const { data } = await axios.patch(
            `${BASE_URL}assign-account/${itemId}`,
            { accountId }
          );
          console.log('✅ Assigned:', data);
      
          // refresh both sides of truth
          await getItems();    // so your ItemsComponentItem sees its new expense
          await getAccounts(); // so your credit‐health view sees the new balance
          await getExpenses();   // for the "Recent Expenses" list
      
          alert('Account assigned successfully ✅');
        } catch (err) {
          console.error('❌ Error assigning account:', err);
          setError(err.response?.data?.message || err.message);
          alert('❌ Failed to assign account');
        }
      };

    // const totalAccounts = () => {
    //     let totalIncome = 0;
    //     expenses.forEach((account) =>{
    //         totalIncome = totalIncome + income.amount
    //     })

    //     return totalIncome;
    // }
    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history.slice(0, 3)
    }

    const getUpcomingRecurringTransactions = async () => {
        try {
            const response = await axios.get(`${BASE_URL}upcoming-recurring-transactions`);
            setUpcomingTransactions(response.data);
            console.log('GET Upcoming Transactions:', response.data);
        } catch (error) {
            setError(error);
        }
    };


    const transferBalance = async (fromAccountId, toAccountId, amount) => {
        try {
            const response = await axios.post(`${BASE_URL}transfer`, {
                fromAccountId,
                toAccountId,
                amount
            });
            console.log(response.data);
            getAccounts(); // Refresh accounts data
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        getAccounts();
        //getUpcomingRecurringTransactions();
    }, []);

   console.log( 'total 🏦:', totalIncome())

    return (
        <GlobalContext.Provider value={
            {
                addIncome,
                getIncome,
                incomes,
                deleteIncome,
                totalIncome,
                deleteExpense,
                totalBalance,
                addExpense,
                totalExpenses,
                expenses,
                getExpenses,
                setError,
                transactionHistory,
                addAccount,
                getAccounts,
                deleteAccount,
                handleAssignAccount,
                accounts,
                upcomingTransactions,
                transferBalance,
                getUpcomingRecurringTransactions,
                getItems,
                addItem,
                deleteItem,
                items
            }
        }>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}