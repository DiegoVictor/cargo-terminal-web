import React, { useEffect, useState, useCallback } from 'react';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  Table,
  Button as Btn,
  ButtonGroup as BtnGroup,
  ButtonToolbar,
  ToggleButton,
  ToggleButtonGroup,
  Form as Frm,
  Spinner,
} from 'react-bootstrap';

import api from '~/services/api';
import Layout from '~/components/Layout';
import Input from '~/components/Input';
import Select from '~/components/Select';
import Description from '~/components/Description';
import { Container, Right, Center } from './styles';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';
import Modal from '~/components/Modal';

const schema = Yup.object().shape({
  name: Yup.string().required(),
  cpf: Yup.string().required(),
  phone: Yup.string().required(),
  birthday: Yup.string().required(),
  cnh_number: Yup.string().required(),
  cnh_type: Yup.string().required(),
  gender: Yup.string().required(),
});

export default () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [show_driver_modal, setShowDriverModal] = useState(false);
  const [disable_driver, confirmDisableDriver] = useState(null);
  const [driver, setDriver] = useState({});
  const [active, setActive] = useState(true);
  const [vehicle, setVehicle] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleDriverForm = useCallback(
    data => {
      (async () => {
        try {
          if (driver._id) {
            const response = await api.put(`/drivers/${driver._id}`, data);
            setDrivers(
              drivers.map(d => {
                if (d._id === driver._id) {
                  return response.data;
                }
                return d;
              })
            );
            toast.success('Motorista atualizado com sucesso!');
          } else {
            const response = await api.post('drivers', data);
            setDrivers([...drivers, response.data]);
            toast.success('Motorista criado com sucesso!');
          }
          setDriver({});
          await setShowDriverModal(false);
        } catch (err) {
          toast.error('Não foi possivel criar o novo motorista');
        }
      })();
    },
    [driver._id, drivers]
  );

  const handleDisableDriver = useCallback(() => {
    (async () => {
      if (disable_driver) {
        try {
          await api.put(`/drivers/${disable_driver._id}`, { active: false });
          confirmDisableDriver(null);
          setDrivers(drivers.filter(d => d._id !== disable_driver._id));
          toast.success('Motorista desativado com sucesso!');
        } catch (err) {
          toast.error('Não foi possivel desativar o motorista');
        }
      }
    })();
  }, [disable_driver, drivers]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await api.get('drivers', {
        params: { active: active ? 1 : 0, vehicle: vehicle ? 1 : 0 },
      });
      setDrivers(data);
      setLoading(false);
    })();
  }, [active, vehicle]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('vehicles');
      setVehicles(data);
    })();
  }, []);

  return (
    <Layout>
      <Container>
        <div>
          <Btn
            data-testid="new"
            size="sm"
            onClick={() => {
              setDriver({});
              setShowDriverModal(true);
            }}
          >
            Novo
          </Btn>

          <Right>
            <ButtonToolbar>
              <ToggleButtonGroup type="checkbox" defaultValue={[1]}>
                <ToggleButton
                  data-testid="active"
                  onClick={() => {
                    if (!loading) {
                      setActive(!active);
                    }
                  }}
                  size="sm"
                  variant="outline-primary"
                  value={1}
                >
                  Ativos
                </ToggleButton>
                <ToggleButton
                  onClick={() => {
                    if (!loading) {
                      setVehicle(!vehicle);
                    }
                  }}
                  size="sm"
                  variant="outline-primary"
                  value={2}
                >
                  Com veiculo proprio
                </ToggleButton>
              </ToggleButtonGroup>
            </ButtonToolbar>
          </Right>
        </div>

        <Table responsive striped hover size="sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th className="hidden-md">Data de Nascimento</th>
              <th>CNH</th>
              <th>CNH Tipo</th>
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
                {drivers.map(driver => (
                  <tr key={`driver_${driver._id}`}>
                    <td>
                      <Description>Nome</Description>
                      {driver.name}
                    </td>
                    <td className="d-none d-sm-table-cell">
                      <Description>CPF</Description>
                      {driver.cpf}
                    </td>
                    <td className="d-none d-sm-table-cell">
                      <Description>Telefone</Description>
                      {driver.phone}
                    </td>

                    <td className="d-none d-lg-table-cell">
                      <Description>Data de Nascimento</Description>
                      {driver.birthday}
                    </td>
                    <td className="d-none d-md-table-cell">
                      <Description>CNH</Description>
                      {driver.cnh_number}
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <Description>CNH Tipo</Description>
                      <span data-testid={`driver_cnh_type_${driver._id}`}>
                        {driver.cnh_type}
                      </span>
                    </td>

                    <td>
                      <BtnGroup>
                        <Btn
                          data-testid={`driver_edit_${driver._id}`}
                          size="sm"
                          type="button"
                          onClick={() => {
                            setDriver(driver);
                            setShowDriverModal(true);
                          }}
                        >
                          Editar
                        </Btn>
                        <Btn
                          data-testid={`driver_disable_${driver._id}`}
                          size="sm"
                          type="button"
                          onClick={() => confirmDisableDriver(driver)}
                        >
                          Desativar
                        </Btn>
                      </BtnGroup>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </Table>

        <Modal
          title="Desativar"
          show={!!disable_driver}
          onHide={() => confirmDisableDriver(false)}
        >
          {disable_driver &&
            `Deseja realmente desativar o(a) motorista ${disable_driver.name}?`}

          <BtnGroup>
            <Btn
              variant="secondary"
              onClick={() => confirmDisableDriver(false)}
            >
              Cancelar
            </Btn>
            <Btn onClick={handleDisableDriver} data-testid="confirm">
              Confirmar
            </Btn>
          </BtnGroup>
        </Modal>

        <Modal
          title="Motorista"
          show={show_driver_modal}
          onHide={() => setShowDriverModal(false)}
        >
          <Form
            initialData={driver}
            schema={schema}
            onSubmit={handleDriverForm}
          >
            <Frm.Group>
              <Frm.Label>Nome</Frm.Label>
              <Input className="form-control" name="name" placeholder="Nome" />
            </Frm.Group>

            <Frm.Group>
              <Frm.Label>CPF</Frm.Label>
              <Input
                className="form-control"
                mask="999.999.999-99"
                name="cpf"
                placeholder="CPF"
              />
            </Frm.Group>

            <Frm.Group>
              <Frm.Label>Telefone</Frm.Label>
              <Input
                className="form-control"
                mask="(99) 99999-9999"
                name="phone"
                placeholder="Telefone"
              />
            </Frm.Group>

            <Frm.Group>
              <Frm.Label>Data de Nascimento</Frm.Label>
              <Input
                className="form-control"
                mask="99/99/9999"
                name="birthday"
                placeholder="Data de Nascimento"
              />
            </Frm.Group>

            <Frm.Group>
              <Frm.Label>Gênero</Frm.Label>
              <Select
                className="form-control"
                name="gender"
                placeholder="Gênero"
              >
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
                <option value="O">Outro</option>
              </Select>
            </Frm.Group>

            <Frm.Group>
              <Frm.Label>CNH</Frm.Label>
              <Input
                className="form-control"
                mask="99999999999"
                name="cnh_number"
                placeholder="CNH"
              />
            </Frm.Group>

            <Frm.Group>
              <Frm.Label>Tipo de CNH</Frm.Label>
              <Select
                className="form-control"
                name="cnh_type"
                placeholder="Tipo de CNH"
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
                <option>E</option>
              </Select>
            </Frm.Group>

            <Frm.Group>
              <Frm.Label>Veiculo</Frm.Label>
              <Select
                className="form-control"
                name="vehicle"
                placeholder="Veículo"
              >
                {vehicles.map(vehicle => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.model} ({VehicleTypeTitle(vehicle.type)})
                  </option>
                ))}
              </Select>
            </Frm.Group>

            <BtnGroup>
              <Btn
                variant="secondary"
                onClick={() => setShowDriverModal(false)}
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
};
