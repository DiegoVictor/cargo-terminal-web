import React, { useState } from 'react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

import api from '~/services/api';
import Input from '~/components/Input';
import Select from '~/components/Select';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';
import Modal from '~/components/Modal';
import { BtnGroup } from './styles';

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
  const [errors, setErrors] = useState({});
  const [selectedGender, setSelectedGender] = useState(driver?.gender ?? 'F');
  const [selectedCnhType, setSelectedCnhType] = useState(
    driver?.cnh_type ?? 'A'
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    driver?.vehicle_id ?? ''
  );

  const send = async (data) => {
    if (data._id) {
      return api.put(`/drivers/${data._id}`, data);
    }

    return api.post('drivers', data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    try {
      const formData = new FormData(event.target);
      const { name, cpf, phone, birthday, cnh_number } = Object.fromEntries(
        formData.entries()
      );

      const data = {
        _id: driver?._id,
        name,
        cpf,
        phone,
        birthday,
        cnh_number,
        gender: selectedGender,
        cnh_type: selectedCnhType,
        vehicle_id: selectedVehicleId,
      };
      await schema.validate(data, { abortEarly: false });

      const response = await send(data);

      save(response.data);
      toast.success('Motorista atualizado/criado com sucesso!');

      setSelectedGender('F');
      setSelectedCnhType('A');
      setSelectedVehicleId('');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });

        setErrors(validationErrors);
      } else {
        toast.error('Não foi possivel criar o novo motorista');
      }
    }
  };

  return (
    <Modal title="Motorista" show={show} onHide={cancel}>
      {show && (
        <form onSubmit={handleSubmit} data-testid="form">
          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Input
              className="form-control"
              name="name"
              placeholder="Nome"
              error={errors.name}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>CPF</Form.Label>
            <Input
              className="form-control"
              mask="999.999.999-99"
              name="cpf"
              placeholder="CPF"
              error={errors.cpf}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Telefone</Form.Label>
            <Input
              className="form-control"
              mask="(99) 99999-9999"
              name="phone"
              placeholder="Telefone"
              error={errors.phone}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Data de Nascimento</Form.Label>
            <Input
              className="form-control"
              mask="99/99/9999"
              name="birthday"
              placeholder="Data de Nascimento"
              error={errors.birthday}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Gênero</Form.Label>
            <Select
              className="form-control"
              name="gender"
              placeholder="Gênero"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              error={errors.gender}
            >
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
              <option value="O">Outro</option>
            </Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>CNH</Form.Label>
            <Input
              className="form-control"
              mask="99999999999"
              name="cnh_number"
              placeholder="CNH"
              error={errors.cnh_number}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Tipo de CNH</Form.Label>
            <Select
              className="form-control"
              name="cnh_type"
              placeholder="Tipo de CNH"
              value={selectedCnhType}
              onChange={(e) => setSelectedCnhType(e.target.value)}
              error={errors.cnh_type}
            >
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
              <option>E</option>
            </Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Veiculo</Form.Label>
            <Select
              className="form-control"
              name="vehicle"
              placeholder="Veículo"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              error={errors.vehicle}
            >
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.model} ({VehicleTypeTitle(vehicle.type)})
                </option>
              ))}
            </Select>
          </Form.Group>

          <BtnGroup>
            <Button variant="secondary" onClick={cancel} data-testid="cancel">
              Cancelar
            </Button>
            <Button data-testid="submit" type="submit">
              Enviar
            </Button>
          </BtnGroup>
        </form>
      )}
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
    gender: PropTypes.string,
    cnh_type: PropTypes.string,
    vehicle_id: PropTypes.string,
  }),
  show: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

DriverForm.defaultProps = {
  driver: null,
};

export default DriverForm;
