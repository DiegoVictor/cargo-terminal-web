import React, { useState, useEffect, useCallback } from 'react';
import { Form } from '@unform/web';
import {
  Table,
  Spinner,
  Button as Btn,
  ButtonGroup as BtnGroup,
  Form as Frm,
  Row,
  Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';

import api from '~/services/api';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';
import Layout from '~/components/Layout';
import Select from '~/components/Select';
import Input from '~/components/Input';
import Modal from '~/components/Modal';
import Description from '~/components/Description';
import { Container, Center, Right } from './styles';

const schema = Yup.object().shape({
  filled: Yup.string().required(),
  vehicle: Yup.string().required(),
  driver: Yup.string().required(),
  origin: Yup.string().required(),
  destination: Yup.string().required(),
});

export default function Terminal() {
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [arrivals, setArrivals] = useState(null);
  const [arrival, setArrival] = useState([]);
  const [date_start, setDateStart] = useState(null);
  const [date_end, setDateEnd] = useState(null);
  const [show_arrival_modal, setShowArrivalModal] = useState(false);

  const handleTerminalForm = useCallback(
    data => {
      (async () => {
        try {
          if (arrival._id) {
            const response = await api.put(`/arrivals/${arrival._id}`, data);
            setArrivals(
              arrivals.map(a => {
                if (a._id === arrival._id) {
                  return response.data;
                }
                return a;
              })
            );
            toast.success('Registro atualizado com sucesso!');
          } else {
            const response = await api.post('arrivals', data);
            setArrivals([...arrivals, response.data]);
            toast.success('Registro criado com sucesso!');
          }
          setArrival({});
          setShowArrivalModal(false);
        } catch (err) {
          toast.error('Não foi possivel criar o novo registro');
        }
      })();
    },
    [arrivals, arrival._id]
  );

  useEffect(() => {
    (async () => {
      const { data } = await api.get('drivers');
      setDrivers(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('vehicles');
      setVehicles(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await api.get('arrivals', {
        params: {
          date_start,
          date_end,
        },
      });
      setArrivals(data);
      setLoading(false);
    })();
  }, [date_start, date_end]);

  return (
    <Layout>
      <Container>
        <div>
          <Btn
            data-testid="new"
            size="sm"
            onClick={() => setShowArrivalModal(true)}
          >
            Novo
          </Btn>

          <Right>
            <Row>
              <Col>
                <DatePicker
                  data-testid="start"
                  className="form-control form-control-sm"
                  selected={date_start}
                  onChange={date => setDateStart(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Inicio"
                />
              </Col>
              <Col>
                <DatePicker
                  data-testid="end"
                  className="form-control form-control-sm"
                  selected={date_end}
                  onChange={date => setDateEnd(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Fim"
                />
              </Col>
            </Row>
          </Right>
        </div>
        <Table striped hover size="sm">
          <thead>
            <tr>
              <th>Motorista</th>
              <th>Veículo</th>
              <th>Carregado</th>
              <th>Origem</th>
              <th>Destino</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">
                  <Center>
                    <Spinner animation="border" />
                  </Center>
                </td>
              </tr>
            ) : (
              <>
                {arrivals.map(arrival => (
                  <tr
                    key={`arrival_${arrival._id}`}
                    data-testid={`arrival_${arrival._id}`}
                  >
                    <td data-testid={`arrival_driver_name_${arrival._id}`}>
                      <Description>Motorista</Description>
                      {arrival.driver.name}
                    </td>
                    <td
                      className="d-none d-md-table-cell"
                      data-testid={`arrival_vehicle_model_${arrival._id}`}
                    >
                      <Description>Veículo</Description>
                      {arrival.vehicle.model} (
                      {VehicleTypeTitle(arrival.vehicle.type)})
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      data-testid={`arrival_filled_${arrival._id}`}
                    >
                      <Description>Carregado</Description>
                      {arrival.filled ? 'Sim' : 'Não'}
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <Description>Origem</Description>
                      <Link
                        to={`//www.google.com.br/maps/place/${arrival.origin[1]},${arrival.origin[0]}`}
                        target="_blank"
                      >
                        {arrival.origin.join(', ')}
                      </Link>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <Description>Destino</Description>
                      <Link
                        to={`//www.google.com.br/maps/place/${arrival.destination[1]},${arrival.destination[0]}`}
                        target="_blank"
                      >
                        {arrival.destination.join(', ')}
                      </Link>
                    </td>
                    <td>
                      <Btn
                        data-testid={`arrival_edit_${arrival._id}`}
                        size="sm"
                        type="button"
                        onClick={() => {
                          setArrival({
                            _id: arrival._id,
                            filled: arrival.filled ? 1 : 0,
                            driver_id: arrival.driver._id,
                            vehicle_id: arrival.vehicle._id,
                            origin: {
                              latitude: arrival.origin[1],
                              longitude: arrival.origin[0],
                            },
                            destination: {
                              latitude: arrival.destination[1],
                              longitude: arrival.destination[0],
                            },
                          });
                          setShowArrivalModal(true);
                        }}
                      >
                        Editar
                      </Btn>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </Table>

        <Modal
          show={show_arrival_modal}
          title="Terminal"
          onHide={() => setShowArrivalModal(false)}
        >
          <Form
            schema={schema}
            initialData={arrival}
            onSubmit={handleTerminalForm}
          >
            <Frm.Group>
              <Frm.Label>Motorista</Frm.Label>
              <Select
                className="form-control"
                name="driver_id"
                placeholder="Motorista"
              >
                {drivers.map(driver => (
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
                {vehicles.map(vehicle => (
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

            <Frm.Group>
              <Frm.Label>Origem</Frm.Label>
              <Row>
                <Col>
                  <Frm.Label>Latidute</Frm.Label>
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
            </Frm.Group>

            <Frm.Group>
              <Frm.Label>Destino</Frm.Label>
              <Row>
                <Col>
                  <Frm.Label>Latidute</Frm.Label>
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
            </Frm.Group>

            <BtnGroup>
              <Btn
                data-testid="cancel"
                variant="secondary"
                onClick={() => setShowArrivalModal(false)}
              >
                Cancelar
              </Btn>
              <Btn data-testid="submit" type="submit">
                Enviar
              </Btn>
            </BtnGroup>
          </Form>
        </Modal>
      </Container>
    </Layout>
  );
}
