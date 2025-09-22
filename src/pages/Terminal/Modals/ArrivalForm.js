import React, { useCallback, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import Select from '~/components/Select';
import Input from '~/components/Input';
import Modal from '~/components/Modal';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';
import api from '~/services/api';
import { BtnGroup, FormGroup } from './styles';

const schema = Yup.object().shape({
  filled: Yup.boolean().required(),
  vehicle_id: Yup.string().required(),
  driver_id: Yup.string().required(),
  origin: Yup.object()
    .shape({
      latitude: Yup.string().required(),
      longitude: Yup.string().required(),
    })
    .required(),
  destination: Yup.object()
    .shape({
      latitude: Yup.string().required(),
      longitude: Yup.string().required(),
    })
    .required(),
});

function ArrivalForm({ arrival, drivers, vehicles, show, cancel, save }) {
  const [errors, setErrors] = useState({});
  const [filled, setFilled] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');

  const send = async (data) => {
    if (data._id) {
      return api.put(`/arrivals/${arrival._id}`, data);
    }
    return api.post('arrivals', data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    try {
      const formData = new FormData(event.target);
      const props = Object.fromEntries(formData.entries());

      const data = {
        _id: arrival?._id,
        origin: {
          latitude: props['origin[latitude]'],
          longitude: props['origin[longitude]'],
        },
        destination: {
          latitude: props['destination[latitude]'],
          longitude: props['destination[longitude]'],
        },
        filled: Boolean(Number(filled)),
        vehicle_id: vehicleId,
        driver_id: driverId,
      };
      await schema.validate(data, { abortEarly: false });

      const response = await send(data);

      save(response.data);
      toast.success('Registro atualizado/criado com sucesso!');

      setFilled('');
      setVehicleId('');
      setDriverId('');
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
        toast.error('Não foi possivel criar o novo registro');
      }
    }
  };

  return (
    <Modal show={show} title="Terminal" onHide={cancel}>
      {show && (
        <form onSubmit={handleSubmit} data-testid="form">
          <Form.Group>
            <Form.Label>Motorista</Form.Label>
            <Select
              className="form-control"
              name="driver_id"
              placeholder="Motorista"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              error={errors.driver_id}
            >
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.name}
                </option>
              ))}
            </Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Veículo</Form.Label>
            <Select
              className="form-control"
              name="vehicle_id"
              placeholder="Veículo"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              error={errors.vehicle_id}
            >
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.model} ({VehicleTypeTitle(vehicle.type)})
                </option>
              ))}
            </Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Carregado</Form.Label>
            <Select
              className="form-control"
              name="filled"
              placeholder="Carregado"
              value={filled}
              onChange={(e) => setFilled(e.target.value)}
              error={errors.filled}
            >
              <option value="0">Não</option>
              <option value="1">Sim</option>
            </Select>
          </Form.Group>

          <FormGroup>
            <strong>
              <Form.Label>Origem</Form.Label>
            </strong>
            <Row>
              <Col>
                <Form.Label>Latitude</Form.Label>
                <Input
                  className="form-control"
                  name="origin[latitude]"
                  data-testid="origin_latitude"
                />
              </Col>
              <Col>
                <Form.Label>Longitude</Form.Label>
                <Input
                  className="form-control"
                  name="origin[longitude]"
                  data-testid="origin_longitude"
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <strong>
              <Form.Label>Destino</Form.Label>
            </strong>
            <Row>
              <Col>
                <Form.Label>Latitude</Form.Label>
                <Input
                  className="form-control"
                  name="destination[latitude]"
                  data-testid="destination_latitude"
                />
              </Col>
              <Col>
                <Form.Label>Longitude</Form.Label>
                <Input
                  className="form-control"
                  name="destination[longitude]"
                  data-testid="destination_longitude"
                />
              </Col>
            </Row>
          </FormGroup>

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
