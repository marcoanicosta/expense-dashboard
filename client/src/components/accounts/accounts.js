import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../contexts/globalContexts';
import Form from '../form/Form';
import AccountsForm from './accountsForm';
import AccountItem from '../accountItem/accountItem'
//import AccountsItem from '../accountsItem/AccountsItem'

function Accounts() {
  const {addAccount, accounts, getAccounts, deleteAccount, totalAccounts} = useGlobalContext()
  const [filter, setFilter] = useState('all'); // State to manage the selected filter

    useEffect(() =>{
      getAccounts()
      console.log('New test 🚨🅿️ 1 ')
    }, [])

    // Filter accounts based on the selected filter
    const filteredAccounts = accounts.filter(account => 
      filter === 'all' ? true : account.type === filter
    );

    return (
      <AccountsStyled>
        <InnerLayout>
          <h1>Accounts</h1>
          {/* <h2 className="total-accounts">Total Accounts: <span>£{totalAccounts()}</span></h2> */}
          <div className="accounts-section">
            <div className="form-container">
              <AccountsForm />
            </div>
            <div className="filter-container">
              <label>Filter by type: </label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="normal">Normal</option>
                <option value="cash">Cash</option>
                <option value="savings">Savings</option>
                <option value="credit">Credit</option>
                <option value="loan">Loan</option>      
              </select>
            </div>
            <div className="accounts">
              {filteredAccounts.map((account) => {
                const { _id, account_name, balance, date, category, description, type } = account;
                return (
                  <AccountItem
                    key={_id}
                    id={_id}
                    account_name={account_name}
                    balance={balance}
                    type={type}
                    indicatorColor="var(--color-green)"
                    deleteItem={deleteAccount}
                  />
                );
              })}
            </div>
          </div>
        </InnerLayout>
      </AccountsStyled>
    );
  }
  
  const AccountsStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-accounts {
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
      span {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--color-green);
      }
    }
    .accounts-content {
      display: flex;
      gap: 2rem;
      .accountss {
        flex: 1;
      }
    }
    .filter-container {
      margin-bottom: 1rem;
      label {
        margin-right: 0.5rem;
      }
      select {
        padding: 0.5rem;
        border-radius: 5px;
        border: 1px solid #ccc;
      }
    }
  `;
  
  export default Accounts;
  //<option value="investment">Investment</option>