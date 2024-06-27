import React, { useEffect } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../contexts/globalContexts';
import Form from '../form/Form';
import ExpenseForm from './ExpenseForm';
import IncomeItem from '../incomeItem/IncomeItem';
//import ExpenseItem from '../expenseItem/ExpenseItem'

function Expense() {
  const {addExpense, expenses, getExpenses, deleteExpense, totalExpenses} = useGlobalContext()

    useEffect(() =>{
      getExpenses()
      console.log('Testing 🚨🅿️ 1 ')
    }, [])

  return (
    <ExpenseStyled>
      <InnerLayout>
        <h1>Expense</h1>
        <h2 className="total-expense">Total Expense: <span>£{totalExpenses()}</span></h2>
        <div className="expense-section">
          <div className="form-container">
            <ExpenseForm />
          </div>
          <div className="expense">
            {expenses.map((expenses) => {
              const {_id, title, amount, date, category, description, type} = expenses;            
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
                  deleteItem={deleteExpense}
              />
            })}
          </div>
        </div>
      </InnerLayout>
    </ExpenseStyled>
  )
}

const ExpenseStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-expense{
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
    .expense-content{
        display: flex;
        gap: 2rem;
        .expenses{
            flex: 1;
        }
    }
`;

export default Expense