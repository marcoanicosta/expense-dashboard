import React, { useEffect } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../contexts/globalContexts';
import Form from '../form/Form';
import IncomeItem from '../incomeItem/IncomeItem'

function Income() {
  const {addIncome, incomes, getIncome, deleteIncome, totalIncome, getAccounts, accounts} = useGlobalContext()

    useEffect(() =>{
      getIncome()
      getAccounts() // Fetch accounts when component mounts
      console.log('Testing 🚨🅿️ 1 - Fetching accounts');
    }, [])

    useEffect(() => {
      console.log('Accounts 🛜:', accounts); // Log accounts data
    }, [accounts]);


  
  return (
    <IncomeStyled>
      <InnerLayout>
        <h1>Income</h1>
        <h2 className="total-income">Total Income: <span>£{totalIncome()}</span></h2>
        <div className="income-section">
          <div className="form-container">
            <Form />
          </div>
          <div className="income">
            {incomes.map((income) => {
              const {_id, title, amount, date, category, description, type} = income;            
              return <IncomeItem
                  key={_id}
                  id={_id} 
                  title={title} 
                  description={description} 
                  amount={amount} 
                  date={date} 
                  type={type}
                  category={category} 
                  indicatorColor="var(--color-green)"
                  deleteItem={deleteIncome}
              />
            })}
          </div>
        </div>
      </InnerLayout>
    </IncomeStyled>
  )
}

const IncomeStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-income{
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
        span{
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }
    .income-content{
        display: flex;
        gap: 2rem;
        .incomes{
            flex: 1;
        }
    }
`;

export default Income