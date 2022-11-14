import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  Table,
  Button as Btn,
  ButtonGroup as BtnGroup,
  ButtonToolbar,
  ToggleButton,
  ToggleButtonGroup,
  Spinner,
} from 'react-bootstrap';

import api from '~/services/api';
import Description from '~/components/Description';
import { Container, Right, Center } from './styles';
import InactivateDriver from './Modals/InactivateDriver';
import DriverForm from './Modals/DriverForm';

function Drivers() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [disableDriver, confirmDisableDriver] = useState(null);
  const [edit, setEdit] = useState({});
  const [active, setActive] = useState(true);
  const [vehicle, setVehicle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggle] = useState([1]);

  const handleDisableDriver = useCallback(() => {
    (async () => {
      if (disableDriver) {
        try {
          await api.put(`/drivers/${disableDriver._id}`, { active: false });

          confirmDisableDriver(null);
          setDrivers(
            drivers.filter((driver) => driver._id !== disableDriver._id)
          );

          toast.success('Motorista desativado com sucesso!');
        } catch (err) {
          toast.error('Não foi possivel desativar o motorista');
        }
      }
    })();
  }, [disableDriver, drivers]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await api.get('drivers', {
        params: { active: Number(active), vehicle: Number(vehicle) },
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
    <Container>
      <div>
        <Btn
          data-testid="new"
          size="sm"
          onClick={() => {
            setEdit({});
            setShowDriverModal(true);
          }}
        >
          Novo
        </Btn>

        <Right>
          <ButtonToolbar>
            <ToggleButtonGroup type="checkbox" defaultValue={toggle} size="sm">
              <ToggleButton
                data-testid="active"
                onClick={() => {
                  if (!loading) {
                    setActive(!active);
                  }
                }}
                variant="outline-primary"
                value={1}
              >
                Ativos
              </ToggleButton>
              <ToggleButton
                data-testid="with-vehicle"
                onClick={() => {
                  if (!loading) {
                    setVehicle(!vehicle);
                  }
                }}
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
              {drivers.map((driver) => (
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
                          setEdit(driver);
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

      <InactivateDriver
        driver={disableDriver}
        cancel={() => confirmDisableDriver(null)}
        handleDisableDriver={handleDisableDriver}
      />

      <DriverForm
        vehicles={vehicles}
        driver={edit}
        show={showDriverModal}
        cancel={() => setShowDriverModal(false)}
        save={(driver) => {
          setShowDriverModal(false);
          setEdit({});

          if (drivers.length > 0) {
            const driverIndex = drivers.findIndex(
              ({ _id }) => _id === driver._id
            );
            if (driverIndex > -1) {
              setDrivers(
                drivers.map((d) => {
                  if (d._id === driver._id) {
                    return driver;
                  }
                  return d;
                })
              );
              return;
            }
          }
          setDrivers([...drivers, driver]);
        }}
      />
    </Container>
  );
}

export default Drivers;
