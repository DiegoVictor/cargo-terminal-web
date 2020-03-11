import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { Router } from 'react-router-dom';
import { toast } from 'react-toastify';

import { act } from 'react-dom/test-utils';
import Drivers from '~/pages/Drivers';
import api from '~/services/api';
import factory from '../../utils/factory';
import history from '~/services/history';

const api_mock = new MockAdapter(api);

jest.mock('react-toastify');
toast.error = jest.fn();

describe('Drivers page', () => {
  it('should be able to list drivers', async () => {
    const drivers = await factory.attrsMany('Driver', 3);
    const vehicles = await factory.attrsMany('Vehicle', 3);

    api_mock
      .onGet('drivers')
      .reply(200, drivers)
      .onGet('vehicles')
      .reply(200, vehicles);

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Drivers />
        </Router>
      );

      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    drivers.forEach(driver => {
      Object.keys(driver).forEach(field => {
        if (!['_id', 'cnh_type', 'gender', 'vehicle'].includes(field)) {
          expect(getByText(driver[field])).toBeInTheDocument();
        }
      });
      expect(getByTestId(`driver_cnh_type_${driver._id}`)).toBeInTheDocument();
    });
  });

  it('should be able to disable a driver', async () => {
    const driver = await factory.attrs('Driver');
    const vehicles = await factory.attrsMany('Vehicle', 3);

    api_mock
      .onGet('drivers')
      .reply(200, [driver])
      .onPut(`/drivers/${driver._id}`)
      .reply(200)
      .onGet('vehicles')
      .reply(200, vehicles);

    let getByTestId;
    let queryByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Drivers />
        </Router>
      );

      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    fireEvent.click(getByTestId(`driver_disable_${driver._id}`));

    await act(async () => {
      fireEvent.click(getByTestId('confirm'));
    });

    expect(
      queryByTestId(`driver_disable_${driver._id}`)
    ).not.toBeInTheDocument();
  });

  it('should not be able to disable a driver', async () => {
    const driver = await factory.attrs('Driver');
    const vehicles = await factory.attrsMany('Vehicle', 3);

    api_mock
      .onGet('drivers')
      .reply(200, [driver])
      .onPut(`/drivers/${driver._id}`)
      .reply(400)
      .onGet('vehicles')
      .reply(200, vehicles);

    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Drivers />
        </Router>
      );

      getByTestId = component.getByTestId;
    });

    fireEvent.click(getByTestId(`driver_disable_${driver._id}`));

    await act(async () => {
      fireEvent.click(getByTestId('confirm'));
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Não foi possivel desativar o motorista'
    );
  });

  it('should be able to create a new driver', async () => {
    const driver = await factory.attrs('Driver');
    const vehicle = await factory.attrs('Vehicle');

    api_mock
      .onGet('drivers')
      .reply(200, [])
      .onPost('drivers')
      .reply(200, driver)
      .onGet('vehicles')
      .reply(200, [vehicle]);

    let getByPlaceholderText;
    let getByTestId;
    let getByText;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Drivers />
        </Router>
      );

      getByTestId = component.getByTestId;
      getByPlaceholderText = component.getByPlaceholderText;
      getByText = component.getByText;
    });

    fireEvent.click(getByTestId('new'));
    fireEvent.change(getByPlaceholderText('Nome'), {
      target: {
        value: driver.name,
      },
    });
    fireEvent.change(getByPlaceholderText('CPF'), {
      target: {
        value: driver.cpf,
      },
    });
    fireEvent.change(getByPlaceholderText('Telefone'), {
      target: {
        value: driver.phone,
      },
    });
    fireEvent.change(getByPlaceholderText('Data de Nascimento'), {
      target: {
        value: driver.birthday,
      },
    });
    fireEvent.change(getByPlaceholderText('Gênero'), {
      target: {
        value: driver.gender,
      },
    });
    fireEvent.change(getByPlaceholderText('CNH'), {
      target: {
        value: driver.cnh_number,
      },
    });
    fireEvent.change(getByPlaceholderText('Tipo de CNH'), {
      target: {
        value: driver.cnh_type,
      },
    });
    fireEvent.change(getByPlaceholderText('Veículo'), {
      target: {
        value: vehicle._id,
      },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    Object.keys(driver).forEach(field => {
      if (!['_id', 'cnh_type', 'gender', 'vehicle'].includes(field)) {
        expect(getByText(driver[field])).toBeInTheDocument();
      }
    });
    expect(getByTestId(`driver_cnh_type_${driver._id}`)).toBeInTheDocument();
  });

  it('should not be able to create a new driver', async () => {
    const driver = await factory.attrs('Driver');
    const vehicle = await factory.attrs('Vehicle');

    api_mock
      .onGet('drivers')
      .reply(200, [])
      .onPost('drivers')
      .reply(400)
      .onGet('vehicles')
      .reply(200, [vehicle]);

    let getByPlaceholderText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Drivers />
        </Router>
      );

      getByTestId = component.getByTestId;
      getByPlaceholderText = component.getByPlaceholderText;
    });

    fireEvent.click(getByTestId('new'));
    fireEvent.change(getByPlaceholderText('Nome'), {
      target: {
        value: driver.name,
      },
    });
    fireEvent.change(getByPlaceholderText('CPF'), {
      target: {
        value: driver.cpf,
      },
    });
    fireEvent.change(getByPlaceholderText('Telefone'), {
      target: {
        value: driver.phone,
      },
    });
    fireEvent.change(getByPlaceholderText('Data de Nascimento'), {
      target: {
        value: driver.birthday,
      },
    });
    fireEvent.change(getByPlaceholderText('Gênero'), {
      target: {
        value: driver.gender,
      },
    });
    fireEvent.change(getByPlaceholderText('CNH'), {
      target: {
        value: driver.cnh_number,
      },
    });
    fireEvent.change(getByPlaceholderText('Tipo de CNH'), {
      target: {
        value: driver.cnh_type,
      },
    });
    fireEvent.change(getByPlaceholderText('Veículo'), {
      target: {
        value: vehicle._id,
      },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Não foi possivel criar o novo motorista'
    );
  });

  it('should be able to edit a driver', async () => {
    const [driver, new_driver, ...rest] = await factory.attrsMany('Driver', 3);
    const vehicle = await factory.attrs('Vehicle');

    new_driver._id = driver._id;

    api_mock
      .onGet('drivers')
      .reply(200, [driver, ...rest])
      .onPut(`/drivers/${driver._id}`)
      .reply(200, new_driver)
      .onGet('vehicles')
      .reply(200, [vehicle]);

    let getByPlaceholderText;
    let getByTestId;
    let getByText;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Drivers />
        </Router>
      );

      getByTestId = component.getByTestId;
      getByPlaceholderText = component.getByPlaceholderText;
      getByText = component.getByText;
    });

    fireEvent.click(getByTestId(`driver_edit_${driver._id}`));
    fireEvent.change(getByPlaceholderText('Nome'), {
      target: {
        value: new_driver.name,
      },
    });
    fireEvent.change(getByPlaceholderText('CPF'), {
      target: {
        value: new_driver.cpf,
      },
    });
    fireEvent.change(getByPlaceholderText('Telefone'), {
      target: {
        value: new_driver.phone,
      },
    });
    fireEvent.change(getByPlaceholderText('Data de Nascimento'), {
      target: {
        value: new_driver.birthday,
      },
    });
    fireEvent.change(getByPlaceholderText('Gênero'), {
      target: {
        value: new_driver.gender,
      },
    });
    fireEvent.change(getByPlaceholderText('CNH'), {
      target: {
        value: new_driver.cnh_number,
      },
    });
    fireEvent.change(getByPlaceholderText('Tipo de CNH'), {
      target: {
        value: new_driver.cnh_type,
      },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    Object.keys(new_driver).forEach(field => {
      if (!['_id', 'cnh_type', 'gender', 'vehicle'].includes(field)) {
        expect(getByText(new_driver[field])).toBeInTheDocument();
      }
    });
    expect(
      getByTestId(`driver_cnh_type_${new_driver._id}`)
    ).toBeInTheDocument();
  });
});
