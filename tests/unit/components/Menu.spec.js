import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes } from 'react-router';
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
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    menus.forEach(({ label, url }) => {
      expect(getByText(label)).toBeInTheDocument();
      expect(getByText(label)).toHaveAttribute('href', url);
    });
  });
});
