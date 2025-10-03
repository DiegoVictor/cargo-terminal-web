import React from 'react';
import { Link as A, useMatch } from 'react-router';
import PropTypes from 'prop-types';

export default function Link({ children, to, ...props }) {
  const match = useMatch({
    path: to,
    exact: true,
  });

  return (
    <div {...props} className={match ? 'active' : ''}>
      <A to={to}>{children}</A>
    </div>
  );
}

Link.propTypes = {
  children: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
