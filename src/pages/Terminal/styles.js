import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  margin-top: 50px;

  table {
    margin-top: 20px;
    width: 100%;
  }
`;

export const Center = styled.div`
  text-align: center;
`;

export const Right = styled.div`
  float: right;
  text-align: right;

  @media (max-width: 500px) {
    float: none;
    margin-top: 10px;
    width: 100%;
  }
`;
