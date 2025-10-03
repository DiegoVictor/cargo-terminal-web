import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { faker } from '@faker-js/faker';

import Link from '~/components/Link';

describe('Link component', () => {
  it('should be able to mark the link as active', () => {
    const linkLabel = faker.lorem.word();
    const { getByTestId } = render(
      <MemoryRouter>
        <Routes>
          <Route
            index
            element={
              <div>
                <Link to="/" data-testid="link">
                  {linkLabel}
                </Link>
              </div>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(getByTestId('link')).toHaveClass('active');
  });
});
