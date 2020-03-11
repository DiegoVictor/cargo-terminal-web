import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  margin-top: 100px;
  width: 100%;

  a {
    padding: 10px;

    @media (max-width: 500px) {
      font-size: 15px;
      padding: 10px 5px;
    }
  }

  .active a {
    border-bottom: 3px solid #007bff;
  }
`;
