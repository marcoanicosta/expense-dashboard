import React, { useState } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../contexts/globalContexts'
import Button from '../button/Button'
import { plus } from '../../utils/Icons';


function ItemsForm() {
    const { addItem, getItems, getAccounts, getExpenses, accounts, error, setError } = useGlobalContext()
    const [inputState, setInputState] = useState({
        item_name: '',
        price: '0',
        due_date: null,
        instalments: '',
        type: '',
        linkedAccount: '',
        fuelType: '',
        litres: '',
        location: '',
        carName: '',
    });

    const { item_name, price, date, type,description } = inputState;

    const handleInput = name => e => {
        setInputState({...inputState, [name]: e.target.value});
        setError('');
    }

    const handleSubmit = async e => {
        e.preventDefault()
        console.log("SUBMITTING ITEM:", inputState); // ✅ Add this
        const itemToSubmit = {
            item_name: inputState.item_name,
            price: inputState.price === '' ? 0 : parseFloat(inputState.price),
            due_date: inputState.due_date,
            instalments: inputState.instalments === '' ? 0 : parseInt(inputState.instalments, 10),
            account: inputState.linkedAccount || null,
            fuelType: inputState.fuelType,
            litres: inputState.litres === '' ? 0 : parseFloat(inputState.litres),
            location: inputState.location,
            carName: inputState.carName,
            type: inputState.type
        };
        await addItem(itemToSubmit)
        await getItems()
+       await getAccounts()
+       await getExpenses()
        setInputState({
            item_name: '',
            price: '0',
            due_date: null,
            instalments: '',
            type: '',
            linkedAccount: '',
            fuelType: '',
            litres: '',
            location: '',
            carName: '',
        });
    }

    return (
        <ItemsFormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input 
                    type="text" 
                    value={item_name}
                    name={'name'} 
                    placeholder="Items Title"
                    onChange={handleInput('item_name')}
                />
            </div>
            <div className="input-control">
                <input 
                    value={price}  
                    type="text" 
                    name={'price'} 
                    placeholder={'Items Price'}
                    onChange={handleInput('price')}
                    disabled={inputState.type === 'fuel'}
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
                    <option value="standard">Standard</option>
                    <option value="fuel">Fuel</option>
                </select>
            </div>
            {inputState.type && (
                <div className="input-control">
                    <select
                        value={inputState.linkedAccount || ''}
                        onChange={handleInput('linkedAccount')}
                    >
                        <option value="">Select Account (Optional)</option>
                        {accounts
                            .filter(acc => acc.type === inputState.type)
                            .map(acc => (
                                <option key={acc._id} value={acc._id}>
                                    {acc.account_name}
                                </option>
                            ))}
                    </select>
                </div>
            )}
            <div className="input-control">
                <DatePicker 
                    placeholderText="Due Date"
                    selected={inputState.due_date}
                    onChange={(date) => setInputState({...inputState, due_date: date})}
                    dateFormat="dd/MM/yyyy"
                />
            </div>

            <div className="input-control">
                <input 
                    type="number"
                    value={inputState.instalments}
                    name="instalments"
                    placeholder="Number of Instalments"
                    onChange={handleInput('instalments')}
                />
            </div>
            {inputState.type === 'fuel' && (
            <>
                <div className="input-control">
                <select value={inputState.fuelType} onChange={handleInput('fuelType')}>
                    <option value="">Select Fuel Type</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                </select>
                </div>
                <div className="input-control">
                <input 
                    type="number"
                    value={inputState.litres}
                    name="litres"
                    placeholder="Litres"
                    onChange={handleInput('litres')}
                />
                </div>
                <div className="input-control">
                <input 
                    type="text"
                    value={inputState.location}
                    name="location"
                    placeholder="Fuel Location"
                    onChange={handleInput('location')}
                />
                </div>
                <div className="input-control">
                <input 
                    type="text"
                    value={inputState.carName}
                    name="carName"
                    placeholder="Car Name"
                    onChange={handleInput('carName')}
                />
                </div>
            </>
            )}
            {/* <div className="input-control">
                <textarea name="description" value={description} placeholder='Add A Reference' id="description" cols="30" rows="4" onChange={handleInput('description')}></textarea>
            </div> */}
            <div className="submit-btn">
                <Button 
                    name={'Add Items'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent'}
                    color={'#fff'}
                />
            </div>
        </ItemsFormStyled>
    )
}


const ItemsFormStyled = styled.form`
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
export default ItemsForm