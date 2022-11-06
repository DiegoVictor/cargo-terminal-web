import React, { useCallback } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import api from '~/services/api';

const schema = Yup.object().shape({
  filled: Yup.string().required(),
  vehicle: Yup.string().required(),
  driver: Yup.string().required(),
  origin: Yup.string().required(),
  destination: Yup.string().required(),
});

function ArrivalForm({ arrival, drivers, vehicles, show, cancel, save }) {
  const handleTerminalForm = useCallback(
    (data) => {
      (async () => {
        try {
          if (arrival._id) {
            const response = await api.put(`/arrivals/${arrival._id}`, data);
            save(response.data);

            toast.success('Registro atualizado com sucesso!');
          } else {
            const response = await api.post('arrivals', data);
            save(response.data);

            toast.success('Registro criado com sucesso!');
          }
        } catch (err) {
          toast.error('Não foi possivel criar o novo registro');
        }
      })();
    },
    [arrival._id, save]
  );

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
