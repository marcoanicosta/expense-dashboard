import React from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../contexts/globalContexts';
import Form from '../form/Form';

function Income() {
  const {addIncome} = useGlobalContext()
  return (
    <IncomeStyled>
      <InnerLayout>
        <h1>Income</h1>
        <div className="income-section">
          <div className="form-container">
            <Form />
          </div>
          <div className="income">
    
          </div>
        </div>
      </InnerLayout>
    </IncomeStyled>
  )
}

const IncomeStyled = styled.div`

`;

export default Income