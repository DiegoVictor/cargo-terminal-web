import React from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';

import Menu from '~/components/Menu';
import Theme, { Container } from './styles';

export default function Layout({ children }) {
  return (
    <Container>
      <Theme />
      <ToastContainer />

      <Menu />

      {children}
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
};
