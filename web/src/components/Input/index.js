import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactInputMask from 'react-input-mask';

import { useField } from '@unform/core';

export default function Input({ name, ...rest }) {
  const inputRef = useRef(null);

  const { fieldName, defaultValue = '', registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <ReactInputMask ref={inputRef} defaultValue={defaultValue} {...rest} />
  );
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
};
