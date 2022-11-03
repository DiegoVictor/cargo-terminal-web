import React, { useCallback } from 'react';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  name: Yup.string().required(),
  cpf: Yup.string().required(),
  phone: Yup.string().required(),
  birthday: Yup.string().required(),
  cnh_number: Yup.string().required(),
  cnh_type: Yup.string().required(),
  gender: Yup.string().required(),
});

function DriverForm({ vehicles, driver, show, cancel, save }) {
}
DriverForm.defaultProps = {
  driver: null,
};

export default DriverForm;
