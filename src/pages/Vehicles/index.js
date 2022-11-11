import React, { useState, useEffect, useCallback } from 'react';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import {
  Table,
  Spinner,
  Button as Btn,
  ButtonGroup as BtnGroup,
  Form as Frm,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import Layout from '~/components/Layout';

import { Container, Center } from './styles';
import api from '~/services/api';
import Input from '~/components/Input';
import Select from '~/components/Select';
import Description from '~/components/Description';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';
import Modal from '~/components/Modal';

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
