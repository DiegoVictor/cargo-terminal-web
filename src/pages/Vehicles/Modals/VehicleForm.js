import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import api from '~/services/api';
const schema = Yup.object().shape({
  model: Yup.string().required(),
  type: Yup.string().required(),
});

function VehicleForm({ vehicle, save, cancel }) {
  const handleVehicleForm = useCallback(
    (data) => {
      (async () => {
        try {
          if (vehicle._id) {
            await api.put(`/vehicles/${vehicle._id}`, data);
            save({
              _id: vehicle._id,
              ...data,
            });
            toast.success('Veículo atualizado com sucesso!');
          } else {
            await api.post('vehicles', data);
            save(data);
            toast.success('Veículo criado com sucesso!');
          }
        } catch (err) {
          toast.error('Não foi possivel criar o novo veículo');
        }
      })();
    },
    [vehicle, save]
  );


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
