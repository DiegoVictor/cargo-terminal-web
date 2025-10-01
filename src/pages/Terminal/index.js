import React, { useState, useEffect } from 'react';
import { Table, Spinner, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import DatePicker from 'react-datepicker';

import api from '~/services/api';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';
import Description from '~/components/Description';
import Form from './Modals/ArrivalForm';
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
    <>
      <Container>
        <div>
          <Button
            data-testid="new"
            size="sm"
            onClick={() => setShowArrivalModal(true)}
          >
            Novo
          </Button>

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
                {arrivals.map((arrival) => (
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
                      <Button
                        data-testid={`arrival_edit_${arrival._id}`}
                        size="sm"
                        type="button"
                        onClick={() => {
                          setEdit({
                            _id: arrival._id,
                            filled: Number(arrival.filled),
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
                      </Button>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </Table>
      </Container>
      <Form
        show={showArrivalModal}
        arrival={edit}
        drivers={drivers}
        vehicles={vehicles}
        cancel={() => setShowArrivalModal(false)}
        save={(arrival) => {
          setShowArrivalModal(false);
          setEdit({});

          if (arrivals.length > 0) {
            const arrivalIndex = arrivals.findIndex(
              ({ _id }) => _id === arrival._id
            );
            if (arrivalIndex > -1) {
              setArrivals(
                arrivals.map((a) => {
                  if (a._id === arrival._id) {
                    return arrival;
                  }
                  return a;
                })
              );
              return;
            }
          }

          setArrivals([...arrivals, arrival]);
        }}
      />
    </>
  );
}

export default Terminal;
