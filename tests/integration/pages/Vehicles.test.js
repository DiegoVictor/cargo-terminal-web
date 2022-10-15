import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';
import factory from '../../utils/factory';
import Vehicles from '~/pages/Vehicles';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';

const api_mock = new MockAdapter(api);

jest.mock('react-toastify');
toast.error = jest.fn();

describe('Vehicles page', () => {
  it('should be able to list vehicles', async () => {
    const vehicles = await factory.attrsMany('Vehicle', 3);
    api_mock.onGet('vehicles').reply(200, vehicles);

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Vehicles />
        </Router>
      );

      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    vehicles.forEach(vehicle => {
      expect(getByText(vehicle.model)).toBeInTheDocument();
      expect(getByTestId(`vehicle_type_${vehicle._id}`)).toBeInTheDocument();
    });
  });

  it('should be able to create a vehicle', async () => {
    const [vehicle, new_vehicle] = await factory.attrsMany('Vehicle', 2, [
      { type: 1 },
      { type: 2 },
    ]);

    api_mock
      .onGet('vehicles')
      .reply(200, [vehicle])
      .onPost('vehicles')
      .reply(200);

    let getByText;
    let getByPlaceholderText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Vehicles />
        </Router>
      );

      getByText = component.getByText;
      getByPlaceholderText = component.getByPlaceholderText;
      getByTestId = component.getByTestId;
    });

    fireEvent.click(getByTestId('new'));
    fireEvent.change(getByPlaceholderText('Modelo'), {
      target: { value: new_vehicle.model },
    });
    fireEvent.change(getByPlaceholderText('Tipo'), {
      target: { value: new_vehicle.type },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText(vehicle.model)).toBeInTheDocument();
    expect(getByText(VehicleTypeTitle(vehicle.type))).toBeInTheDocument();
  });

  it('should be able to edit a vehicle', async () => {
    const [new_vehicle, vehicle, ...rest] = await factory.attrsMany(
      'Vehicle',
      3,
      [{ type: 1 }, { type: 2 }, { type: 3 }]
    );

    api_mock
      .onGet('vehicles')
      .reply(200, [vehicle, ...rest])
      .onPut(`/vehicles/${vehicle._id}`)
      .reply(200);

    let getByText;
    let getByPlaceholderText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Vehicles />
        </Router>
      );

      getByText = component.getByText;
      getByPlaceholderText = component.getByPlaceholderText;
      getByTestId = component.getByTestId;
    });

    fireEvent.click(getByTestId(`vehicle_${vehicle._id}`));
    fireEvent.change(getByPlaceholderText('Modelo'), {
      target: { value: new_vehicle.model },
    });
    fireEvent.change(getByPlaceholderText('Tipo'), {
      target: { value: new_vehicle.type },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText(new_vehicle.model)).toBeInTheDocument();
    expect(getByText(VehicleTypeTitle(new_vehicle.type))).toBeInTheDocument();
  });

  it('should not be able to edit a vehicle', async () => {
    const [new_vehicle, vehicle, ...rest] = await factory.attrsMany(
      'Vehicle',
      3
    );

    api_mock
      .onGet('vehicles')
      .reply(200, [vehicle, ...rest])
      .onPut(`/vehicles/${vehicle._id}`)
      .reply(400);

    let getByPlaceholderText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Vehicles />
        </Router>
      );

      getByPlaceholderText = component.getByPlaceholderText;
      getByTestId = component.getByTestId;
    });

    fireEvent.click(getByTestId(`vehicle_${vehicle._id}`));
    fireEvent.change(getByPlaceholderText('Modelo'), {
      target: { value: new_vehicle.model },
    });
    fireEvent.change(getByPlaceholderText('Tipo'), {
      target: { value: new_vehicle.type },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Não foi possivel criar o novo veículo'
    );
  });
});
