import React, { useCallback } from 'react';
import { Form } from '@unform/web';
import { Button as Btn, Form as Frm, Row, Col } from 'react-bootstrap';
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

  return (
    <Modal show={show} title="Terminal" onHide={cancel}>
      {show && (
        <Form
          schema={schema}
          initialData={arrival}
          onSubmit={handleTerminalForm}
          data-testid="form"
        >
          <Frm.Group>
            <Frm.Label>Motorista</Frm.Label>
            <Select
              className="form-control"
              name="driver_id"
              placeholder="Motorista"
            >
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.name}
                </option>
              ))}
            </Select>
          </Frm.Group>

          <Frm.Group>
            <Frm.Label>Veículo</Frm.Label>
            <Select
              className="form-control"
              name="vehicle_id"
              placeholder="Veículo"
            >
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.model} ({VehicleTypeTitle(vehicle.type)})
                </option>
              ))}
            </Select>
          </Frm.Group>

          <Frm.Group>
            <Frm.Label>Carregado</Frm.Label>
            <Select
              className="form-control"
              name="filled"
              placeholder="Carregado"
            >
              <option value="0">Não</option>
              <option value="1">Sim</option>
            </Select>
          </Frm.Group>

          <FormGroup>
            <strong>
              <Frm.Label>Origem</Frm.Label>
            </strong>
            <Row>
              <Col>
                <Frm.Label>Latitude</Frm.Label>
                <Input
                  className="form-control"
                  name="origin[latitude]"
                  data-testid="latitude_origin"
                />
              </Col>
              <Col>
                <Frm.Label>Longitude</Frm.Label>
                <Input
                  className="form-control"
                  name="origin[longitude]"
                  data-testid="longitude_origin"
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <strong>
              <Frm.Label>Destino</Frm.Label>
            </strong>
            <Row>
              <Col>
                <Frm.Label>Latitude</Frm.Label>
                <Input
                  className="form-control"
                  name="destination[latitude]"
                  data-testid="latitude_destination"
                />
              </Col>
              <Col>
                <Frm.Label>Longitude</Frm.Label>
                <Input
                  className="form-control"
                  name="destination[longitude]"
                  data-testid="longitude_destination"
                />
              </Col>
            </Row>
          </FormGroup>

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
