import React, { useState } from 'react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Button, Form } from 'react-bootstrap';
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
  const [errors, setErrors] = useState({});
  const [selectedType, setSelectedType] = useState(vehicle?.type ?? '1');

  const send = (data) => {
    if (data._id) {
      return api.put(`/vehicles/${data._id}`, data);
    }
    return api.post('/vehicles', data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    try {
      const formData = new FormData(event.target);
      const { model } = Object.fromEntries(formData.entries());

      const data = {
        _id: vehicle?._id,
        model,
        type: selectedType,
      };
      await schema.validate(data, { abortEarly: false });

      await send(data);
      save(data);

      toast.success('Veículo atualizado/criado com sucesso!');
      setSelectedType('1');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });

        setErrors(validationErrors);
      } else {
        toast.error('Não foi possivel criar o novo veículo');
      }
    }
  };

  return (
    <Modal show={!!vehicle} onHide={cancel} title="Veículo">
      {vehicle && (
        <form onSubmit={handleSubmit} method="post" data-testid="form">
          <Form.Group>
            <Form.Label>Modelo</Form.Label>
            <Input
              className="form-control"
              name="model"
              placeholder="Modelo"
              error={errors.model}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Tipo</Form.Label>
            <Select
              className="form-control"
              name="type"
              placeholder="Tipo"
              error={errors.type}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="1">Caminhão 3/4</option>
              <option value="2">Caminhão Toco</option>
              <option value="3">Caminhão Truck</option>
              <option value="4">Carreta Simples</option>
              <option value="5">Carreta Eixo Extendido</option>
            </Select>
          </Form.Group>

          <BtnGroup>
            <Button data-testid="cancel" variant="secondary" onClick={cancel}>
              Cancelar
            </Button>
            <Button data-testid="submit" type="submit">
              Enviar
            </Button>
          </BtnGroup>
        </form>
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
