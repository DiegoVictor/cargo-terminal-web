import React from 'react';
import PropTypes from 'prop-types';
import ReactInputMask from 'react-input-mask';

export default function Input({ name, type = 'text', mask, error, ...rest }) {
  if (mask) {
    return (
      <>
        <ReactInputMask name={name} {...rest} />
        {error && <span>{error}</span>}
      </>
    );
  }

  return (
    <>
      <input name={name} type={type} {...rest} />
      {error && <span>{error}</span>}
    </>
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  error: PropTypes.string,
  mask: PropTypes.string,
};

Input.defaultProps = {
  error: null,
  type: 'text',
  mask: null,
};
