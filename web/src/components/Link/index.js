import React from 'react';
import { Link as A, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Link({ children, to }) {
  const match = useRouteMatch({
    path: to,
    exact: true,
  });

  return (
    <div className={match ? 'active' : ''}>
      <A to={to}>{children}</A>
    </div>
  );
}

Link.propTypes = {
  children: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
