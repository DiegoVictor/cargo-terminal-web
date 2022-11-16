import React, { useCallback } from 'react';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Button as Btn, Form as Frm } from 'react-bootstrap';
import PropTypes from 'prop-types';

import api from '~/services/api';
import Input from '~/components/Input';
import Select from '~/components/Select';
import Modal from '~/components/Modal';
import { BtnGroup } from './styles';

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

  return (
    <Modal show={!!vehicle} onHide={cancel} title="Veículo">
      {vehicle && (
        <Form
          initialData={vehicle}
          schema={schema}
          onSubmit={handleVehicleForm}
          data-testid="form"
        >
          <Frm.Group>
            <Frm.Label>Modelo</Frm.Label>
            <Input className="form-control" name="model" placeholder="Modelo" />
          </Frm.Group>

          <Frm.Group>
            <Frm.Label>Tipo</Frm.Label>
            <Select className="form-control" name="type" placeholder="Tipo">
              <option value="1">Caminhão 3/4</option>
              <option value="2">Caminhão Toco</option>
              <option value="3">Caminhão Truck</option>
              <option value="4">Carreta Simples</option>
              <option value="5">Carreta Eixo Extendido</option>
            </Select>
          </Frm.Group>

          <BtnGroup>
            <Btn data-testid="cancel" variant="secondary" onClick={cancel}>
              Cancelar
            </Btn>
            <Btn data-testid="submit" type="submit">
              Enviar
            </Btn>
          </BtnGroup>
        </Form>
      )}
    </Modal>
  );
}

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
