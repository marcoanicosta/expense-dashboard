import React, { useState } from 'react'
import styled from 'styled-components';
import { dollar, calender, comment, trash, money, freelance, stocks, users, bitcoin, card, yt, piggy, book, food, medical, tv, takeaway, clothing, circle } from '../../../utils/Icons';
import Button from '../../button/Button';




function ItemsComponentItem({
    id,
    item_name,
    price,
    instalments,
    date,
    category,
    description,
    deleteItem,
    account,
    accounts,
    handleAssignAccount,
    indicatorColor,
    type,
    expenses
}) {

    const [showLogs, setShowLogs] = useState(false)

    const categoryIcon = () =>{
        switch(category) {
            case 'salary':
                return money;
            case 'freelancing':
                return freelance
            case 'investments':
                return stocks;
            case 'stocks':
                return users;
            case 'bitcoin':
                return bitcoin;
            case 'bank':
                return card;
            case 'youtube':
                return yt;
            case 'other':
                return piggy;
            default:
                return ''
        }
    }
    const expenseCatIcon = () => {
        switch (category) {
            case 'education':
                return book;
            case 'groceries':
                return food;
            case 'health':
                return medical;
            case 'subscriptions':
                return tv;
            case 'takeaways':
                return takeaway;
            case 'clothing':
                return clothing;
            case 'travelling':
                return freelance;
            case 'fuel':
                return piggy;
            case 'other':
                return circle;
            default:
                return ''
        }
    }

    return (
        <ItemItemStyled indicator={indicatorColor}>
            <div className="icon">
                {type === 'expense' ? expenseCatIcon() : categoryIcon()}
            </div>
            <div className="content">
                <h5>{item_name}</h5>
                <div className="inner-content">
                    <div className='text'>
                        <p>{dollar} {price}</p>
                        {/* <p>{calender} {date}</p> */}
                        <p>
                            {comment}
                            {instalments}
                        </p>
                    </div>
                    <div className="btn-con">
                        {!account && accounts && (
                            <select
                                onChange={e => handleAssignAccount(id, e.target.value)}
                                style={{ marginRight: '0.5rem' }}
                            >
                                <option value="">Assign Account</option>
                                {accounts.map(acc => (
                                    <option key={acc._id} value={acc._id}>
                                        {acc.account_name}
                                    </option>
                                ))}
                            </select>
                        )}
                        <Button 
                            icon={trash}
                            bPad={'1rem'}
                            bRad={'50%'}
                            bg={'var(--primary-color'}
                            color={'#fff'}
                            iColor={'#fff'}
                            hColor={'var(--color-green)'}
                            onClick={() => deleteItem(id)}
                        />
                    </div>
                </div>
            </div>
  
            {type === 'fuel' && expenses && expenses.length > 0 && (
              <div className="fuel-logs">
                <button onClick={() => setShowLogs(!showLogs)}>
                  {showLogs
                    ? 'Hide Fuel Logs'
                    : `View Fuel Logs (${expenses.length} entries)`}
                </button>
                {showLogs && (
                  <ul>
                    {expenses.map(exp => {
                      const { extra = {} } = exp;
                      const { litres = '–', fuelType = 'N/A', location = 'N/A' } = extra;
                      return (
                        <li key={exp._id}>
                          £{exp.amount} for {litres}L ({fuelType}) @ {location} – {new Date(exp.date).toLocaleDateString()}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
        
        </ItemItemStyled>
    )
}

const ItemItemStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    color: #222260;
    .icon{
        width: 80px;
        height: 80px;
        border-radius: 20px;
        background: #F5F5F5;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
        i{
            font-size: 2.6rem;
        }
    }

    .content{
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: .2rem;
        h5{
            font-size: 1.3rem;
            padding-left: 2rem;
            position: relative;
            &::before{
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: .8rem;
                height: .8rem;
                border-radius: 50%;
                background: ${props => props.indicator};
            }
        }

        .inner-content{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .text{
                display: flex;
                align-items: center;
                gap: 1.5rem;
                p{
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary-color);
                    opacity: 0.8;
                }
            }
        }
    }
`;

export default ItemsComponentItem