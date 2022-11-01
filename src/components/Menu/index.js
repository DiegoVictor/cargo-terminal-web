import React from 'react';

import Link from '~/components/Link';
import { Container } from './styles';

function Menu() {
  return (
    <Container>
      <Link className="nav-link" to="/">
        Terminal
      </Link>

      <Link className="nav-link" to="/travels">
        Viagens
      </Link>

      <Link className="nav-link" to="/drivers">
        Motoristas
      </Link>

      <Link className="nav-link" to="/vehicles">
        Veiculos
      </Link>
    </Container>
  );
}

export default Menu;
