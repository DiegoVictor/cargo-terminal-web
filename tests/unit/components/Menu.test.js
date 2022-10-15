import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';

import history from '~/services/history';
import Menu from '~/components/Menu';

describe('Link component', () => {
  it('should be able to mark the link as active', () => {
    const menus = [
      { label: 'Terminal', url: '/' },
      { label: 'Motoristas', url: '/drivers' },
      { label: 'Veiculos', url: '/vehicles' },
      { label: 'Viagens', url: '/travels' },
    ];
    const { getByText } = render(
      <Router history={history}>
        <Menu />
      </Router>
    );

    menus.forEach(({ label, url }) => {
      expect(getByText(label)).toBeInTheDocument();
      expect(getByText(label)).toHaveAttribute('href', url);
    });
  });
});
