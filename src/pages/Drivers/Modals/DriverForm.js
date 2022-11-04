import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import api from '~/services/api';

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
  const handleDriverForm = useCallback(
    async (data) => {
      try {
        if (driver._id) {
          const response = await api.put(`/drivers/${driver._id}`, data);
          save(response.data);
          toast.success('Motorista atualizado com sucesso!');
        } else {
          const response = await api.post('drivers', data);
          save(response.data);
          toast.success('Motorista criado com sucesso!');
        }
      } catch (err) {
        toast.error('Não foi possivel criar o novo motorista');
      }
    },
    [driver._id, save]
  );

}

DriverForm.propTypes = {
  vehicles: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      type: PropTypes.number.isRequired,
    })
  ).isRequired,
  driver: PropTypes.shape({
    _id: PropTypes.string,
  }),
  show: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

DriverForm.defaultProps = {
  driver: null,
};

export default DriverForm;
