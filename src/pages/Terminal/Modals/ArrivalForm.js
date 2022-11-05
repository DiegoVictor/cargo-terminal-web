import React, { useCallback } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

const schema = Yup.object().shape({
  filled: Yup.string().required(),
  vehicle: Yup.string().required(),
  driver: Yup.string().required(),
  origin: Yup.string().required(),
  destination: Yup.string().required(),
});

function ArrivalForm({ arrival, drivers, vehicles, show, cancel, save }) {
}

ArrivalForm.propTypes = {
  drivers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  vehicles: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      type: PropTypes.number.isRequired,
    })
  ).isRequired,
  cancel: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  arrival: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  show: PropTypes.bool.isRequired,
};

export default ArrivalForm;
