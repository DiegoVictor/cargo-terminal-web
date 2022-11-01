import styled, { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

export const Container = styled.div`
  height: 100%;
  margin: auto;
  max-width: 1000px;
  padding: 0px 20px;
`;

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0px;
    padding: 0px;
    outline: 0px;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    background-color: #fbfbfb;
    -webkit-font-smoothing: antialiased !important;
  }

  body, input, button {
    font-family: Roboto, Arial, Helvetica, sans-serif, Arial, Helvetica, sans-serif;
  }

  button {
    cursor: pointer;
  }

  input {
    width: 100%
  }

  @media (max-width: 991px) {
    thead {
      display: none;
    }
  }
`;
