import React, { useState } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../contexts/globalContexts'
import Button from '../button/Button'
import { plus } from '../../utils/Icons';


function AccountsForm() {
    const {addAccount, error, setError} = useGlobalContext()
    const [inputState, setInputState] = useState({
        account_name: '',
        balance: '',
        type: '',
    })

    const { account_name, balance, date, type,description } = inputState;

    const handleInput = account_name => e => {
        setInputState({...inputState, [account_name]: e.target.value})
        setError('')
    }

    const handleSubmit = e => {
        e.preventDefault();
    
        const parsedBalance = parseFloat(inputState.balance);
        const accountToSubmit = {
            ...inputState,
            balance: isNaN(parsedBalance) ? 0 : parsedBalance
        };
    
        console.log("Submitting:", accountToSubmit);
        addAccount(accountToSubmit);
    
        setInputState({
            account_name: '',
            balance: '',
            type: '',
        });
    };

    return (
        <AccountsFormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input 
                    type="text" 
                    value={account_name}
                    name={'name'} 
                    placeholder="Accounts Title"
                    onChange={handleInput('account_name')}
                />
            </div>
            <div className="input-control">
                <input value={balance}  
                    type="text" 
                    name={'balance'} 
                    placeholder={'Accounts Balance'}
                    onChange={handleInput('balance')} 
                />
            </div>
            {/* <div className="input-control">
                <DatePicker 
                    id='date'
                    placeholderText='Enter A Date'
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setInputState({...inputState, date: date})
                    }}
                />
            </div> */}
            <div className="selects input-control">
                <select required value={type} name="type" id="type" onChange={handleInput('type')}>
                    <option value="" disabled >Select Option</option>
                    <option value="normal">normal</option>
                    <option value="cash">Cash</option>
                    <option value="savings">Savings</option>
                    <option value="credit">Credit</option>
                    <option value="business">Business</option>
                </select>
            </div>
            {/* <div className="input-control">
                <textarea name="description" value={description} placeholder='Add A Reference' id="description" cols="30" rows="4" onChange={handleInput('description')}></textarea>
            </div> */}
            <div className="submit-btn">
                <Button 
                    name={'Add Accounts'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent'}
                    color={'#fff'}
                />
            </div>
        </AccountsFormStyled>
    )
}


const AccountsFormStyled = styled.form`
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
export default AccountsForm