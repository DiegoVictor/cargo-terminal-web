import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { Router } from 'react-router-dom';
import { toast } from 'react-toastify';
import { act } from 'react-dom/test-utils';

import Drivers from '~/pages/Drivers';
import api from '~/services/api';
import history from '~/services/history';
import factory from '../../utils/factory';
import { __esModule } from 'react-datepicker';

const apiMock = new MockAdapter(api);

jest.mock('react-toastify');
toast.error = jest.fn();

jest.mock('react-input-mask', () => {
  return {
    __esModule: true,
    default: ({ ...props }) => <input type="text" {...props} />,
  };
});

describe('Drivers page', () => {
  it('should be able to list drivers', async () => {
    const drivers = await factory.attrsMany('Driver', 3);
    const vehicles = await factory.attrsMany('Vehicle', 3);

    apiMock
      .onGet('drivers')
      .reply(200, drivers)
      .onGet('vehicles')
      .reply(200, vehicles);

    const { getByText, getByTestId } = render(
      <Router history={history}>
        <Drivers />
      </Router>
    );

    const [{ name }] = drivers;
    await waitFor(() => getByText(name));

    drivers.forEach((driver) => {
      Object.keys(driver).forEach((field) => {
        if (!['_id', 'cnh_type', 'gender', 'vehicle'].includes(field)) {
          expect(getByText(driver[field])).toBeInTheDocument();
        }
      });
      expect(getByTestId(`driver_cnh_type_${driver._id}`)).toBeInTheDocument();
    });
  });

  it('should be able to list active drivers', async () => {
    const drivers = await factory.attrsMany('Driver', 3);
    const vehicles = await factory.attrsMany('Vehicle', 3);

    apiMock
      .onGet('drivers')
      .reply(200, [])
      .onGet('drivers')
      .reply(200, drivers)
      .onGet('vehicles')
      .reply(200, vehicles);

    const { getByText, getByTestId } = render(
      <Router history={history}>
        <Drivers />
      </Router>
    );

    const [{ name }] = drivers;
    await waitFor(() => getByText(name));

    await act(async () => {
      fireEvent.click(getByTestId('active'));
    });

    drivers.forEach((driver) => {
      Object.keys(driver).forEach((field) => {
        if (!['_id', 'cnh_type', 'gender', 'vehicle'].includes(field)) {
          expect(getByText(driver[field])).toBeInTheDocument();
        }
      });
      expect(getByTestId(`driver_cnh_type_${driver._id}`)).toBeInTheDocument();
    });
  });

  it('should be able to list drivers with vehicle', async () => {
    const drivers = await factory.attrsMany('Driver', 3);
    const vehicles = await factory.attrsMany('Vehicle', 3);

    apiMock
      .onGet('drivers')
      .reply(200, [])
      .onGet('drivers')
      .reply(200, drivers)
      .onGet('vehicles')
      .reply(200, vehicles);

    const { getByText, getByTestId } = render(
      <Router history={history}>
        <Drivers />
      </Router>
    );

    const [{ name }] = drivers;
    await waitFor(() => getByText(name));

    await act(async () => {
      fireEvent.click(getByTestId('with-vehicle'));
    });

    drivers.forEach((driver) => {
      Object.keys(driver).forEach((field) => {
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

    apiMock
      .onGet('drivers')
      .reply(200, [driver])
      .onPut(`/drivers/${driver._id}`)
      .reply(200)
      .onGet('vehicles')
      .reply(200, vehicles);

    const { getByTestId, queryByTestId, getByText } = render(
      <Router history={history}>
        <Drivers />
      </Router>
    );

    await waitFor(() => getByText(driver.name));

    fireEvent.click(getByTestId(`driver_disable_${driver._id}`));

    await act(async () => {
      fireEvent.click(getByTestId('confirm'));
    });

    expect(
      queryByTestId(`driver_disable_${driver._id}`)
    ).not.toBeInTheDocument();
  });

  it('should be able to cancel the driver disabling', async () => {
    const driver = await factory.attrs('Driver');
    const vehicles = await factory.attrsMany('Vehicle', 3);

    apiMock
      .onGet('drivers')
      .reply(200, [driver])
      .onGet('vehicles')
      .reply(200, vehicles);

    const { getByTestId, getByText, queryByTestId } = render(
      <Router history={history}>
        <Drivers />
      </Router>
    );

    await waitFor(() => getByText(driver.name));

    fireEvent.click(getByTestId(`driver_disable_${driver._id}`));

    expect(
      getByText(`Deseja realmente desativar o(a) motorista ${driver.name}?`)
    ).toBeInTheDocument();

    fireEvent.click(getByTestId('cancel'));

    expect(
      queryByTestId(`Deseja realmente desativar o(a) motorista ${driver.name}?`)
    ).not.toBeInTheDocument();
  });

  it('should not be able to disable a driver', async () => {
    const driver = await factory.attrs('Driver');
    const vehicles = await factory.attrsMany('Vehicle', 3);

    apiMock
      .onGet('drivers')
      .reply(200, [driver])
      .onPut(`/drivers/${driver._id}`)
      .reply(400)
      .onGet('vehicles')
      .reply(200, vehicles);

    const { getByTestId, getByText } = render(
      <Router history={history}>
        <Drivers />
      </Router>
    );

    await waitFor(() => getByText(driver.name));

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

    apiMock
      .onGet('drivers')
      .reply(200, [])
      .onPost('drivers')
      .reply(200, driver)
      .onGet('vehicles')
      .reply(200, [vehicle]);

    const { getByPlaceholderText, getByTestId, getByText } = render(
      <Router history={history}>
        <Drivers />
      </Router>
    );

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

    await waitFor(() => getByText(driver.name));

    Object.keys(driver).forEach((field) => {
      if (!['_id', 'cnh_type', 'gender', 'vehicle'].includes(field)) {
        expect(getByText(driver[field])).toBeInTheDocument();
      }
    });
    expect(getByTestId(`driver_cnh_type_${driver._id}`)).toBeInTheDocument();
  });

  it('should not be able to create a new driver', async () => {
    const driver = await factory.attrs('Driver');
    const vehicle = await factory.attrs('Vehicle');

    apiMock
      .onGet('drivers')
      .reply(200, [])
      .onPost('drivers')
      .reply(400)
      .onGet('vehicles')
      .reply(200, [vehicle]);

    const { getByPlaceholderText, getByTestId } = render(
      <Router history={history}>
        <Drivers />
      </Router>
    );

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

  it('should be able to see validation errors', async () => {
    const driver = await factory.attrs('Driver');
    const vehicle = await factory.attrs('Vehicle');

    apiMock
      .onGet('drivers')
      .reply(200, [])
      .onGet('vehicles')
      .reply(200, [vehicle]);

    const { getByText, getByTestId } = render(
      <Router history={history}>
        <Drivers />
      </Router>
    );

    fireEvent.click(getByTestId('new'));

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    [
      'name',
      'cpf',
      'phone',
      'birthday',
      'cnh_number',
      'cnh_type',
      'gender',
    ].forEach((field) => {
      expect(getByText(`${field} is a required field`)).toBeInTheDocument();
    });
  });

  it('should be able to edit a driver', async () => {
    const [driver, newDriver, ...rest] = await factory.attrsMany('Driver', 3);
    const vehicle = await factory.attrs('Vehicle');

    newDriver._id = driver._id;

    apiMock
      .onGet('drivers')
      .reply(200, [driver, ...rest])
      .onPut(`/drivers/${driver._id}`)
      .reply(200, newDriver)
      .onGet('vehicles')
      .reply(200, [vehicle]);

    const { getByPlaceholderText, getByTestId, getByText } = render(
      <Router history={history}>
        <Drivers />
      </Router>
    );

    await waitFor(() => getByText(driver.name));

    fireEvent.click(getByTestId(`driver_edit_${driver._id}`));
    fireEvent.change(getByPlaceholderText('Nome'), {
      target: {
        value: newDriver.name,
      },
    });
    fireEvent.change(getByPlaceholderText('CPF'), {
      target: {
        value: newDriver.cpf,
      },
    });
    fireEvent.change(getByPlaceholderText('Telefone'), {
      target: {
        value: newDriver.phone,
      },
    });
    fireEvent.change(getByPlaceholderText('Data de Nascimento'), {
      target: {
        value: newDriver.birthday,
      },
    });
    fireEvent.change(getByPlaceholderText('Gênero'), {
      target: {
        value: newDriver.gender,
      },
    });
    fireEvent.change(getByPlaceholderText('CNH'), {
      target: {
        value: newDriver.cnh_number,
      },
    });
    fireEvent.change(getByPlaceholderText('Tipo de CNH'), {
      target: {
        value: newDriver.cnh_type,
      },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    await waitFor(() => getByText(newDriver.name));

    Object.keys(newDriver).forEach((field) => {
      if (!['_id', 'cnh_type', 'gender', 'vehicle'].includes(field)) {
        expect(getByText(newDriver[field])).toBeInTheDocument();
      }
    });
    expect(getByTestId(`driver_cnh_type_${newDriver._id}`)).toBeInTheDocument();
  });

  it('should be able to cancel the driver edition', async () => {
    const [driver, newDriver, ...rest] = await factory.attrsMany('Driver', 3);
    const vehicle = await factory.attrs('Vehicle');

    newDriver._id = driver._id;

    apiMock
      .onGet('drivers')
      .reply(200, [driver, ...rest])
      .onGet('vehicles')
      .reply(200, [vehicle]);

    const { getByTestId, queryByTestId, getByText } = render(
      <Router history={history}>
        <Drivers />
      </Router>
    );

    await waitFor(() => getByText(driver.name));

    fireEvent.click(getByTestId(`driver_edit_${driver._id}`));
    expect(getByTestId('form')).toBeInTheDocument();

    fireEvent.click(getByTestId('cancel'));

    expect(queryByTestId('form')).not.toBeInTheDocument();
  });
});
