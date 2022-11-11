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
                {vehicles.map(vehicle => (
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

        <Modal show={!!vehicle} onHide={() => setVehicle(null)} title="Veículo">
          {vehicle && (
            <Form
              initialData={vehicle}
              schema={schema}
              onSubmit={handleVehicleForm}
            >
              <Frm.Group>
                <Frm.Label>Modelo</Frm.Label>
                <Input
                  className="form-control"
                  name="model"
                  placeholder="Modelo"
                />
              </Frm.Group>

              <Frm.Group>
                <Frm.Label>Tipo</Frm.Label>
                <Select className="form-control" name="type" placeholder="Tipo">
                  <option value="1">Caminhão 3/4</option>
                  <option value="2">Caminhão Toco</option>
                  <option value="3">Caminhão ​Truck</option>
                  <option value="4">Carreta Simples</option>
                  <option value="5">Carreta Eixo Extendido</option>
                </Select>
              </Frm.Group>

              <BtnGroup>
                <Btn
                  data-testid="cancel"
                  variant="secondary"
                  onClick={() => setVehicle(false)}
                >
                  Cancelar
                </Btn>
                <Btn data-testid="submit" type="submit">
                  Enviar
                </Btn>
              </BtnGroup>
            </Form>
          )}
        </Modal>
      </Container>
    </Layout>
  );
}

export default Vehicles;
