import React, { useEffect } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../contexts/globalContexts';
import Form from '../form/Form';
import AccountsForm from './accountsForm';
import AccountItem from '../accountItem/accountItem'
//import AccountsItem from '../accountsItem/AccountsItem'

function Accounts() {
  const {addAccount, accounts, getAccounts, deleteAccount, totalAccounts} = useGlobalContext()

    useEffect(() =>{
      getAccounts()
      console.log('New test 🚨🅿️ 1 ')
    }, [])

  return (
    <AccountsStyled>
      <InnerLayout>
        <h1>Accounts</h1>
        {/* <h2 className="total-accounts">Total Accounts: <span>£{totalAccounts()}</span></h2> */}
        <div className="accounts-section">
          <div className="form-container">
            <AccountsForm />
          </div>
          <div className="accounts">
            {accounts.map((accounts) => {
              const {_id, account_name, balance, date, category, description, type} = accounts;            
              return <AccountItem
                  key={_id}
                  id={_id} 
                  account_name={account_name} 
                  balance={balance} 
                  type={type}
                  indicatorColor="var(--color-green)"
                  deleteItem={deleteAccount}
              />
            })}
          </div>
        </div>
      </InnerLayout>
    </AccountsStyled>
  )
}

const AccountsStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-accounts{
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
    .accounts-content{
        display: flex;
        gap: 2rem;
        .accountss{
            flex: 1;
        }
    }
`;

export default Accounts