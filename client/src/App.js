import styled from 'styled-components';
import bg from './img/bg.png'
import { MainLayout } from './styles/Layouts'
import Orb from "./components/orb/Orb";
import Navigation from './components/navigation/Navigation';
import React, {useMemo, useState } from 'react';
import Dashboard from './components/dashboard/Dashboard';
import Transaction from './components/transaction/Transaction';
import Income from './components/income/Income';
import Expenses from './components/expenses/Expenses';
import Accounts from './components/accounts/accounts';
import { useGlobalContext } from './contexts/globalContexts';

function App() {
  const [active, setActive] = useState(1)

  const global = useGlobalContext();
  console.log(global)

  //console.log(`${active}: This is active ✅`)
  const displayData = () => { 
    switch(active) {
      case 1:
        return <Dashboard />
      case 2:
        return <Transaction />
      case 3:
        return <Accounts />
      case 4:
        return <Income />
      case 5:
          return <Expenses />
      default:
        return <Dashboard />
    }
  }

  const orbMemo = useMemo(() => {
    return <Orb />
  },[])
  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main>
         {displayData()} 
        </main>
      </MainLayout>
    </AppStyled>
  );
}



const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main{
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar{
      width: 0;
    }
  }
`;

export default App;
