import React, { useCallback } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

const schema = Yup.object().shape({
  model: Yup.string().required(),
  type: Yup.string().required(),
});

function VehicleForm({ vehicle, save, cancel }) {

VehicleForm.propTypes = {
  vehicle: PropTypes.shape({
    _id: PropTypes.string,
  }),
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

VehicleForm.defaultProps = {
  vehicle: null,
};

export default VehicleForm;
