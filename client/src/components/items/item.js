import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../contexts/globalContexts';
import Form from '../form/Form';
import ItemsForm from './itemForm';
import ItemsComponentItem from './itemsComponentItem/ItemsComponentItem'
//import ItemsItem from '../itemsItem/ItemsItem'

function Items() {
    const {addItem, items, getItems, deleteItem} = useGlobalContext()
    const [filter, setFilter] = useState('all'); // State to manage the selected filter

    useEffect(() =>{
        getItems()
      console.log('New test 🚨🅿️ 1 ')
    }, [])

    // Filter items based on the selected filter
    // const filteredItems = items.filter(item => 
    //   filter === 'all' ? true : item.type === filter
    // );

    return (
      <ItemsStyled>
        <InnerLayout>
          <h1>Items</h1>
          {/* <h2 className="total-items">Total Items: <span>£{totalItems()}</span></h2> */}
          <div className="items-section">
            <div className="form-container">
              <ItemsForm />
            </div>
            <div className="filter-container">
              <label>Filter by type: </label>
            
            </div>
            <div className="items">
                {items.map(item => {
                    return (
                    <ItemsComponentItem 
                        key={item._id}
                        {...item}
                        price={item.price}
                        deleteItem={deleteItem}
                    />
                    )
                })}
            </div>
          </div>
        </InnerLayout>
      </ItemsStyled>
    );
  }
  
  const ItemsStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-items {
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
    .items-content {
      display: flex;
      gap: 2rem;
      .itemss {
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
  
  export default Items;
  //<option value="investment">Investment</option>