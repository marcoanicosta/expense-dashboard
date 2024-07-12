import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../../contexts/globalContexts';
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts';
import IncomeItem from '../incomeItem/IncomeItem'

function Transaction() {
    const { addIncome, incomes, expenses, getIncome, getExpenses, getAccounts, accounts } = useGlobalContext();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(''); // State to hold the selected account

    useEffect(() => {
        getIncome();
        getExpenses();
        getAccounts(); // Fetch accounts
        console.log('Testing 🚨🅿️: Transactions');
    }, []);

    // Combine incomes and expenses into one array
    const transactions = [...incomes, ...expenses];

    // Filter transactions based on the selected date range and selected account
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        const accountMatch = selectedAccount ? transaction.account === selectedAccount : true;
        return transactionDate >= start && transactionDate <= end && accountMatch;
    });

    // Sort the filtered transactions by date
    const sortedTransactions = filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <TransactionStyled>
            <InnerLayout>
                <h1>Transaction</h1>
                <div className="transaction-section">
                    <div className="form-container">
                        <div className="test">TRANSACTION</div>
                        <div className="filters">
                            <div className="date-filters">
                                <label>
                                    Start Date:
                                    <input 
                                        type="date" 
                                        value={startDate} 
                                        onChange={(e) => setStartDate(e.target.value)} 
                                    />
                                </label>
                                <label>
                                    End Date:
                                    <input 
                                        type="date" 
                                        value={endDate} 
                                        onChange={(e) => setEndDate(e.target.value)} 
                                    />
                                </label>
                            </div>
                            <div className="account-filter">
                                <label>
                                    Account:
                                    <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
                                        <option value="">All Accounts</option>
                                        {accounts.map(account => (
                                            <option key={account._id} value={account._id}>
                                                {account.account_name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="transaction">
                        {sortedTransactions.map((transaction) => {
                            const { _id, title, amount, date, category, description, type } = transaction;            
                            return <IncomeItem
                                key={_id}
                                id={_id} 
                                title={title} 
                                description={description} 
                                amount={amount} 
                                date={date} 
                                type={type}
                                category={category} 
                                indicatorColor={type === 'income' ? "var(--color-green)" : "var(--color-red)"}
                            />
                        })}
                    </div>
                </div>
            </InnerLayout>
        </TransactionStyled>
    )
}

const TransactionStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-transaction {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
            color: var(--color-red);
        }
    }
    .transaction-content {
        display: flex;
        gap: 2rem;
        .transactions {
            flex: 1;
        }
    }
    .filters {
        display: flex;
        flex-direction: column;
        .date-filters, .account-filter {
            margin-bottom: 1rem;
            label {
                display: flex;
                flex-direction: column;
                margin-bottom: 1rem;
            }
        }
    }
`;

export default Transaction;