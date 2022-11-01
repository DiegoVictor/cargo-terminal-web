import React from 'react';
import { ToastContainer } from 'react-toastify';

import Navigation from '~/routes';
import Theme, { Container } from './styles/theme';

function App() {
  return (
    <Container>
      <Theme />
      <ToastContainer />

      <Navigation />
    </Container>
  );
}

export default App;
