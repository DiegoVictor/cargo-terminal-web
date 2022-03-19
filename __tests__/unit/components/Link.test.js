import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import faker from 'faker';

import history from '~/services/history';
import Link from '~/components/Link';

describe('Link component', () => {
  it('should be able to mark the link as active', () => {
    const link_label = faker.random.word();
    const { container } = render(
      <Router history={history}>
        <Link to="/">{link_label}</Link>
      </Router>
    );

    expect(container.firstChild.classList.contains('active')).toBe(true);
  });
});
