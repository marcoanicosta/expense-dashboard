import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../contexts/globalContexts';

function CreditHealth() {
    const { accounts, expenses, items, getAccounts, getExpenses, getItems } = useGlobalContext();

    useEffect(() => {
        getAccounts();
        getExpenses();
        getItems();
    }, []);

    const creditAccounts = accounts.filter(acc => acc.type === 'credit');

    const getCreditHealth = (balance, limit) => {
        const utilization = Math.abs(balance) / limit;
        if (utilization <= 0.3) return { label: 'Great!', color: 'lightblue' };
        if (utilization <= 0.49) return { label: 'Good', color: 'green' };
        if (utilization <= 0.74) return { label: 'Improve', color: 'orange' };
        return { label: 'Critical', color: 'red' };
    };

    return (
        <CreditStyled>
            <h1>Credit Health</h1>
            {creditAccounts.map(account => {
                const { _id, account_name, balance, creditLimit = 1, apr } = account;
                const health = getCreditHealth(balance, creditLimit);

                const linkedItems = items.filter(item => item.account === _id);
                const creditExpenses = expenses.filter(exp => exp.account === _id);

                // Estimate payoff: avg monthly payment = total this month
                const now = new Date();
                const thisMonthExpenses = creditExpenses.filter(exp => new Date(exp.date).getMonth() === now.getMonth());
                const monthlyTotal = thisMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
                const estimatedMonthsToPayoff = monthlyTotal > 0 ? Math.ceil(Math.abs(balance) / monthlyTotal) : 'N/A';

                return (
                    <div className="credit-card" key={_id}>
                        {/* Placeholder card */}
                        <div className="card-visual">
                            <h2>{account_name}</h2>
                            <p>Balance: £{balance}</p>
                            <p>Limit: £{creditLimit}</p>
                            <p style={{ color: '#fff' }}>
                                Score: <span style={{ color: health.color }}>{health.label}</span>
                            </p>
                        </div>

                        <div className="details">
                            <p><strong>APR:</strong> {apr || 'N/A'}%</p>
                            <p><strong>Est. Months to Pay Off:</strong> {estimatedMonthsToPayoff}</p>

                            <h3>Recent Expenses:</h3>
                            <ul>
                                {creditExpenses.slice(0, 5).map(e => (
                                    <li key={e._id}>
                                        {e.title} - £{e.amount} on {new Date(e.date).toLocaleDateString()}
                                    </li>
                                ))}
                            </ul>

                            <h3>Items Purchased on Credit:</h3>
                            <ul>
                                {linkedItems.map(i => (
                                    <li key={i._id}>{i.item_name} - £{i.price}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            })}
        </CreditStyled>
    );
}

const CreditStyled = styled.div`
    padding: 2rem;
    h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
    }
    .credit-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin-bottom: 2rem;
    }
    .card-visual {
        background: #222260;
        color: #fff;
        padding: 1rem;
        border-radius: 12px;
        margin-bottom: 1rem;
    }
    .details ul {
        margin-top: 0.5rem;
        padding-left: 1rem;
    }
`;

export default CreditHealth;