import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../contexts/globalContexts';
import zopa from '../../assets/cards/zopa.png';
import monzo from '../../assets/cards/monzo.png';
import jaja from '../../assets/cards/jaja.png';
import zable from '../../assets/cards/zable.png';
import capital from '../../assets/cards/capital.png';

const cardImages = {
    zopa,
    monzo,
    jaja,
    zable,
    capital
};

const sanitizeName = (name) => {
    return name.toLowerCase().replace(/[^\w]/gi, '');
  };


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

                const cardKey = sanitizeName(account_name);
                const cardImageSrc = cardImages[cardKey];

                const linkedItems = items.filter(item => item.account === _id);
                const creditExpenses = expenses.filter(exp => exp.account === _id);

                const now = new Date();
                const thisMonthExpenses = creditExpenses.filter(
                    exp => new Date(exp.date).getMonth() === now.getMonth() &&
                           new Date(exp.date).getFullYear() === now.getFullYear()
                );
                const monthlyTotal = thisMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
                const estimatedMonthsToPayoff = monthlyTotal > 0 ? Math.ceil(Math.abs(balance) / monthlyTotal) : 'N/A';

                const utilizationPercent = Math.min(Math.abs(balance) / creditLimit, 1) * 100;

                return (
                    <div className="credit-card" key={_id}>
                        <div className="card-visual">
                            {cardImageSrc && (
                                <img 
                                src={cardImageSrc} 
                                alt={`${account_name} card`} 
                                className="credit-card-img"
                                />
                            )}
                            <div className="card-overlay">
                                <div className="card-text">
                                <h2>{account_name}</h2>
                                <p>Balance: £{balance}</p>
                                <p>Limit: £{creditLimit}</p>
                                <p>
                                    Score: <span style={{ color: health.color }}>{health.label}</span>
                                </p>
                                </div>
                                <div className="progress-bar">
                                <div 
                                    className="progress" 
                                    style={{ width: `${utilizationPercent}%`, background: health.color }}
                                />
                                </div>
                            </div>
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
                                {creditExpenses.length === 0 && <li>No recent expenses</li>}
                            </ul>

                            <h3>Items Purchased on Credit:</h3>
                            <ul>
                                {linkedItems.map(i => (
                                    <li key={i._id}>{i.item_name} - £{i.price}</li>
                                ))}
                                {linkedItems.length === 0 && <li>No items linked to this credit account</li>}
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
        margin-bottom: 1.5rem;
    }
    .credit-card {
        background: #fff;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin-bottom: 2rem;
    }
    .card-visual {
    position: relative;
    width: 100%;
    max-width: 380px;
    margin-bottom: 1rem;
    border-radius: 16px;
    overflow: hidden;

    .credit-card-img {
        width: 100%;
        height: auto;
        display: block;
        object-fit: cover;
    }

    .card-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 1rem;
        width: 100%;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .card-text {
            h2, p {
            margin: 0.2rem 0;
            }
        }

        .progress-bar {
            margin-top: 0.5rem;
            height: 8px;
            background: #ddd;
            border-radius: 5px;
            overflow: hidden;

            .progress {
            height: 100%;
                }
            }
        }
    }
    .details {
        ul {
            margin-top: 0.5rem;
            padding-left: 1rem;
        }
        h3 {
            margin-top: 1rem;
            margin-bottom: 0.5rem;
        }
    }
`;

export default CreditHealth;