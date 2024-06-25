import styled from 'styled-components';
import bg from './img/bg.png'
import { MainLayout } from './styles/Layouts'
import Orb from "./components/orb/Orb";
import Navigation from './components/navigation/Navigation';
import React, { useMemo, useState } from 'react';



function App() {
  const [active, setActive] = useState(1)

  const orbMemo = useMemo(() => {
    return <Orb />
  },[])
  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main>
          
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
