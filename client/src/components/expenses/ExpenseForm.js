import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../contexts/globalContexts'
import Button from '../button/Button'
import { plus } from '../../utils/Icons'; 

function ExpenseForm() {
    const { addExpense, error, setError, getAccounts, getItems, getExpenses, accounts: contextAccounts, items } = useGlobalContext()
 // add an `extra` sub-object in your form state
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: null,
        category: '',
        description: '',
        accountId:  '',      // only used for non-fuel
        fuelItemId: '',      // choose which fuel‐item
        extra: {             // all fuel fields go here
            litres: '',
            location: '',
            carName: '',
            fuelType: ''
        }
    })

    const { title, amount, date, category, description, accountId } = inputState;

    useEffect(() => {
        console.log('Accounts in Form 🛜🅿️:', contextAccounts); // Log accounts data in Form
    }, [contextAccounts]);

    useEffect(() => {
        getItems();
    }, []);

    const handleInput = name => e => {
        const value = e.target.value;
        if (['litres','location','carName','fuelType'].includes(name)) {
            setInputState(prevState => ({
                ...prevState,
                extra: {
                    ...prevState.extra,
                    [name]: value
                }
            }));
            console.log('Updated Input State:', {
                ...inputState,
                extra: {
                    ...inputState.extra,
                    [name]: value
                }
            });
        } else {
            setInputState(prevState => ({
                ...prevState,
                [name]: name === 'amount' ? (parseInt(value, 10) || 0) : value
            }));
            console.log('Updated Input State:', {
                ...inputState,
                [name]: name === 'amount' ? (parseInt(value, 10) || 0) : value
            });
        }
    };

 const handleSubmit = async e => {
        e.preventDefault()
                // build a payload that matches your server‐side API
        const payload = {
          title:       inputState.title,
          amount:      parseFloat(inputState.amount) || 0,
          date:        inputState.date,
          category:    inputState.category,
          description: inputState.description,

          // for fuel, derive account from the fuel‐item itself
          accountId:
            inputState.category === 'fuel' && inputState.fuelItemId
              ? (items.find(i => i._id === inputState.fuelItemId) || {}).account
              : inputState.accountId,

          // wrap all fuel‐specific fields into the `extra` object
          extra: inputState.category === 'fuel'
            ? { ...inputState.extra }
            : undefined,
          fuelItemId: inputState.fuelItemId
        }
        await addExpense(payload)
        await getExpenses()
        await getAccounts()
        await getItems()     
        setInputState({
            title: '',
            amount: '',
            date: null,
            category: '',
            description: '',
            accountId: '',
            fuelItemId: '',
            extra: {
                litres: '',
                location: '',
                carName: '',
                fuelType: ''
            }
        })
    }

    return (
        <ExpenseFormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input 
                    type="text" 
                    value={title || ''}
                    name={'title'} 
                    placeholder="Expense Title"
                    onChange={handleInput('title')}
                />
            </div>
            <div className="input-control">
                <input value={amount || ''}  
                    type="text" 
                    name={'amount'} 
                    placeholder={'Expense Amount'}
                    onChange={handleInput('amount')} 
                />
            </div>
            <div className="input-control">
                <DatePicker 
                    id='date'
                    placeholderText='Enter A Date'
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setInputState({...inputState, date: date})
                    }}
                />
            </div>
            <div className="selects input-control">
                <select required value={category || ''} name="category" id="category" onChange={handleInput('category')}>
                    <option value="" disabled >Select Option</option>
                    <option value="education">Education</option>
                    <option value="groceries">Groceries</option>
                    <option value="health">Health</option>
                    <option value="subscriptions">Subscriptions</option>
                    <option value="takeaways">Takeaways</option>
                    <option value="clothing">Clothing</option>  
                    <option value="travelling">Travelling</option>  
                    <option value="other">Other</option>  
                    <option value="fuel">Fuel</option>
                </select>
            </div>
            <div className="input-control">
                <textarea name="description" value={description || ''} placeholder='Add A Reference' id="description" cols="30" rows="4" onChange={handleInput('description')}></textarea>
            </div>
            {/* only show account selector for non-fuel */}
            {inputState.category !== 'fuel' && (
              <div className="selects input-control">
                <select
                  required
                  value={inputState.accountId || ''}
                  onChange={handleInput('accountId')}
                >
                  <option value="" disabled>Select Account</option>
                  {contextAccounts.map(acc => (
                    <option key={acc._id} value={acc._id}>
                      {acc.account_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {inputState.category === 'fuel' && (
                <>
                    <div className="input-control">
                        <input 
                            type="number"
                            value={inputState.extra.litres || ''}
                            name="litres"
                            placeholder="Litres"
                            onChange={handleInput('litres')}
                        />
                    </div>
                    <div className="input-control">
                        <input 
                            type="text"
                            value={inputState.extra.location || ''}
                            name="location"
                            placeholder="Fuel Location"
                            onChange={handleInput('location')}
                        />
                    </div>
                    <div className="selects input-control">
                      <select
                        value={inputState.fuelItemId || ''}
                        onChange={handleInput('fuelItemId')}
                      >
                        <option value="">Assign to Fuel Item (optional)</option>
                        {items
                          .filter(i => i.type === 'fuel')
                          .map(i => (
                            <option key={i._id} value={i._id}>
                              {i.item_name}
                            </option>
                          ))}
                      </select>
                    </div>
                </>
            )}
            <div className="submit-btn">
                <Button 
                    name={'Add Expense'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent'}
                    color={'#fff'}
                />
            </div>
        </ExpenseFormStyled>
    )
}


const ExpenseFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    input, textarea, select{
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .5rem 1rem;
        border-radius: 5px;
        border: 2px solid #fff;
        background: transparent;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
        &::placeholder{
            color: rgba(34, 34, 96, 0.4);
        }
    }
    .input-control{
        input{
            width: 100%;
        }
    }

    .selects{
        display: flex;
        justify-content: flex-end;
        select{
            color: rgba(34, 34, 96, 0.4);
            &:focus, &:active{
                color: rgba(34, 34, 96, 1);
            }
        }
    }

    .submit-btn{
        button{
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            &:hover{
                background: var(--color-green) !important;
            }
        }
    }
`;
export default ExpenseForm