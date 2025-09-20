import React from 'react';
import PropTypes from 'prop-types';

export default function Select({ name, children, error, ...rest }) {
  return (
    <>
      <select {...rest}>{children}</select>
      {error && <span>{error}</span>}
    </>
  );
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  error: PropTypes.string,
};

Select.defaultProps = {
  error: null,
};
