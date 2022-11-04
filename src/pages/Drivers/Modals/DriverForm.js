import React, { useCallback } from 'react';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  Button as Btn,
  ButtonGroup as BtnGroup,
  Form as Frm,
} from 'react-bootstrap';
import PropTypes from 'prop-types';

import api from '~/services/api';
import Input from '~/components/Input';
import Select from '~/components/Select';
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

function DriverForm({ vehicles, driver, show, cancel, save }) {
  const handleDriverForm = useCallback(
    async (data) => {
      try {
        if (driver._id) {
          const response = await api.put(`/drivers/${driver._id}`, data);
          save(response.data);
          toast.success('Motorista atualizado com sucesso!');
        } else {
          const response = await api.post('drivers', data);
          save(response.data);
          toast.success('Motorista criado com sucesso!');
        }
      } catch (err) {
        toast.error('Não foi possivel criar o novo motorista');
      }
    },
    [driver._id, save]
  );

  return (
    <Modal title="Motorista" show={show} onHide={cancel}>
      <Form initialData={driver} schema={schema} onSubmit={handleDriverForm}>
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
          <Select className="form-control" name="gender" placeholder="Gênero">
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
          <Select className="form-control" name="vehicle" placeholder="Veículo">
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.model} ({VehicleTypeTitle(vehicle.type)})
              </option>
            ))}
          </Select>
        </Frm.Group>

        <BtnGroup>
          <Btn variant="secondary" onClick={cancel}>
            Cancelar
          </Btn>
          <Btn data-testid="submit" type="submit">
            Enviar
          </Btn>
        </BtnGroup>
      </Form>
    </Modal>
  );
}

DriverForm.propTypes = {
  vehicles: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      type: PropTypes.number.isRequired,
    })
  ).isRequired,
  driver: PropTypes.shape({
    _id: PropTypes.string,
  }),
  show: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

DriverForm.defaultProps = {
  driver: null,
};

export default DriverForm;
