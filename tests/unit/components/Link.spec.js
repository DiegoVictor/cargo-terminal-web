import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { faker } from '@faker-js/faker';

import history from '~/services/history';
import Link from '~/components/Link';

describe('Link component', () => {
  it('should be able to mark the link as active', () => {
    const linkLabel = faker.lorem.word();
    const { container } = render(
      <Router history={history}>
        <Link to="/">{linkLabel}</Link>
      </Router>
    );

    expect(container.firstChild.classList.contains('active')).toBe(true);
  });
});
