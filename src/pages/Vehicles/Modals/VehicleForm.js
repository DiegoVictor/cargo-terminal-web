import React, { useCallback } from 'react';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  model: Yup.string().required(),
  type: Yup.string().required(),
});

function VehicleForm({ vehicle, save, cancel }) {

export default VehicleForm;
