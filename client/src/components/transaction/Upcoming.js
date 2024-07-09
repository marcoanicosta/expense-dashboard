import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../contexts/globalContexts';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import IncomeItem from '../incomeItem/IncomeItem';

function Transaction() {
    const { upcomingTransactions, getUpcomingRecurringTransactions } = useGlobalContext();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        getUpcomingRecurringTransactions();
        console.log('Fetching upcoming recurring transactions');
    }, []);

    useEffect(() => {
        console.log('Upcoming Transactions:', upcomingTransactions);
    }, [upcomingTransactions]);

    // Simplify filtering logic
    const filteredTransactions = upcomingTransactions.filter(transaction => transaction.nextOccurrence);
    console.log('Filtered Transactions:', filteredTransactions);

    const sortedTransactions = filteredTransactions.sort((a, b) => new Date(a.nextOccurrence) - new Date(b.nextOccurrence));
    console.log('Sorted Transactions:', sortedTransactions);

    return (
        <TransactionStyled>
            <InnerLayout>
                <h1>Upcoming Transactions</h1>
                <div className="transaction-section">
                    <div className="form-container">
                        <div className="test">Upcoming Transactions</div>
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
                    </div>
                    <div className="transaction">
                        {sortedTransactions.map((transaction) => {
                            const { _id, title, amount, nextOccurrence, category, description, type } = transaction;
                            return (
                                <IncomeItem
                                    key={_id}
                                    id={_id}
                                    title={title}
                                    description={description}
                                    amount={amount}
                                    date={nextOccurrence}
                                    type={type}
                                    category={category}
                                    indicatorColor={type === 'income' ? "var(--color-blue)" : "var(--color-grey)"}
                                />
                            );
                        })}
                    </div>
                </div>
            </InnerLayout>
        </TransactionStyled>
    );
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
            color: var(--color-blue);
            color: var(--color-grey);
        }
    }
    .transaction-content {
        display: flex;
        gap: 2rem;
        .transactions {
            flex: 1;
        }
    }
    .date-filters {
        display: flex;
        flex-direction: column;
        label {
            margin-bottom: 1rem;
        }
    }
`;

export default Transaction;