import React, { useState, useEffect } from 'react';
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

function Terminal() {
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [arrivals, setArrivals] = useState(null);
  const [edit, setEdit] = useState({});
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [showArrivalModal, setShowArrivalModal] = useState(false);

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
          date_start: dateStart,
          date_end: dateEnd,
        },
      });
      setArrivals(data);
      setLoading(false);
    })();
  }, [dateStart, dateEnd]);

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
                  selected={dateStart}
                  onChange={(date) => setDateStart(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Inicio"
                />
              </Col>
              <Col>
                <DatePicker
                  data-testid="end"
                  className="form-control form-control-sm"
                  selected={dateEnd}
                  onChange={(date) => setDateEnd(date)}
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

export default Terminal;
