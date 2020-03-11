import React from 'react';
import { Modal as Md } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function Modal({ title, children, ...props }) {
  return (
    <Md {...props}>
      <Md.Header>
        <Md.Title>{title}</Md.Title>
      </Md.Header>
      <Md.Body>{children}</Md.Body>
    </Md>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.node,
  ]),
};

Modal.defaultProps = {
  children: null,
};
