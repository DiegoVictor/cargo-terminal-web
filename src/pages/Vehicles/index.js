import React, { useState, useEffect } from 'react';
import { Table, Spinner, Button as Btn } from 'react-bootstrap';

import api from '~/services/api';
import Description from '~/components/Description';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';
import Form from '~/pages/Vehicles/Modals/VehicleForm';
import { Container, Center } from './styles';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await api.get('vehicles');
      setVehicles(data);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Container>
        <div>
          <Btn data-testid="new" size="sm" onClick={() => setEdit({})}>
            Novo
          </Btn>
        </div>
        <Table striped hover size="sm">
          <thead>
            <tr>
              <th>Model</th>
              <th>Tipo</th>
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
                {vehicles.map((vehicle) => (
                  <tr key={`vehicle_${vehicle._id}`}>
                    <td>
                      <Description>Modelo</Description>
                      {vehicle.model}
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      data-testid={`vehicle_type_${vehicle._id}`}
                    >
                      <Description>Tipo</Description>
                      {VehicleTypeTitle(vehicle.type)}
                    </td>

                    <td>
                      <Btn
                        data-testid={`vehicle_${vehicle._id}`}
                        size="sm"
                        type="button"
                        onClick={() => {
                          setEdit(vehicle);
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
      </Container>
      <Form
        vehicle={edit}
        cancel={() => setEdit(null)}
        save={(vehicle) => {
          if (vehicle._id) {
            setVehicles(
              vehicles.map((v) => {
                if (v._id === vehicle._id) {
                  return vehicle;
                }
                return v;
              })
            );
          } else {
            setVehicles([...vehicles, vehicle]);
          }
          setEdit(null);
        }}
      />
    </>
  );
}

export default Vehicles;
