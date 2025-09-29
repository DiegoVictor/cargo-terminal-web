import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';
import Vehicles from '~/pages/Vehicles';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';
import factory from '../../utils/factory';

const apiMock = new MockAdapter(api);

jest.mock('react-toastify');
toast.error = jest.fn();

describe('Vehicles page', () => {
  it('should be able to list vehicles', async () => {
    const vehicles = await factory.attrsMany('Vehicle', 3);

    apiMock.onGet('vehicles').reply(200, vehicles);

    const { getByText, getByTestId } = render(
      <Router history={history}>
        <Vehicles />
      </Router>
    );

    const [{ _id }] = vehicles;
    await waitFor(() => getByTestId(`vehicle_${_id}`));

    vehicles.forEach((vehicle) => {
      expect(getByText(vehicle.model)).toBeInTheDocument();
      expect(getByTestId(`vehicle_type_${vehicle._id}`)).toBeInTheDocument();
    });
  });

  it('should be able to create a vehicle', async () => {
    const [vehicle, newVehicle] = await factory.attrsMany('Vehicle', 2);

    vehicle.type = '1';
    newVehicle.type = '2';

    apiMock
      .onGet('vehicles')
      .reply(200, [vehicle])
      .onPost('vehicles')
      .reply(200);

    const { getByText, getByPlaceholderText, getByTestId, debug } = render(
      <Router history={history}>
        <Vehicles />
      </Router>
    );

    await waitFor(() => getByTestId(`vehicle_${vehicle._id}`));

    fireEvent.click(getByTestId('new'));

    fireEvent.change(getByPlaceholderText('Modelo'), {
      target: { value: newVehicle.model },
    });
    fireEvent.change(getByPlaceholderText('Tipo'), {
      target: { value: newVehicle.type },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText(vehicle.model)).toBeInTheDocument();
    expect(getByText(VehicleTypeTitle(vehicle.type))).toBeInTheDocument();
  });

  it('should be able to see validation errors', async () => {
    const [vehicle, newVehicle] = await factory.attrsMany('Vehicle', 2);

    vehicle.type = '1';
    newVehicle.type = '2';

    apiMock.onGet('vehicles').reply(200, [vehicle]);

    const { getByText, getByPlaceholderText, getByTestId, debug } = render(
      <Router history={history}>
        <Vehicles />
      </Router>
    );

    await waitFor(() => getByTestId(`vehicle_${vehicle._id}`));

    fireEvent.click(getByTestId('new'));

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    ['model', 'type'].forEach((field) => {
      expect(getByText(`${field} is a required field`)).toBeInTheDocument();
    });
  });

  it('should be able to edit a vehicle', async () => {
    const [newVehicle, vehicle, ...rest] = await factory.attrsMany(
      'Vehicle',
      3,
      [{ type: 1 }, { type: 2 }, { type: 3 }]
    );

    apiMock
      .onGet('vehicles')
      .reply(200, [vehicle, ...rest])
      .onPut(`/vehicles/${vehicle._id}`)
      .reply(200);

    const { getByText, getByPlaceholderText, getByTestId, debug } = render(
      <Router history={history}>
        <Vehicles />
      </Router>
    );

    await waitFor(() => getByTestId(`vehicle_${vehicle._id}`));

    fireEvent.click(getByTestId(`vehicle_${vehicle._id}`));
    fireEvent.change(getByPlaceholderText('Modelo'), {
      target: { value: newVehicle.model },
    });
    fireEvent.change(getByPlaceholderText('Tipo'), {
      target: { value: newVehicle.type },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    await waitFor(() => getByText(newVehicle.model));

    expect(getByText(newVehicle.model)).toBeInTheDocument();
    expect(getByText(VehicleTypeTitle(newVehicle.type))).toBeInTheDocument();
  });

  it('should be able to cancel the vehicle edition', async () => {
    const vehicle = await factory.attrs('Vehicle', { type: 1 });

    apiMock.onGet('vehicles').reply(200, [vehicle]);

    const { getByTestId, queryByTestId } = render(
      <Router history={history}>
        <Vehicles />
      </Router>
    );

    await waitFor(() => getByTestId(`vehicle_${vehicle._id}`));

    fireEvent.click(getByTestId(`vehicle_${vehicle._id}`));
    expect(getByTestId('form')).toBeInTheDocument();

    fireEvent.click(getByTestId('cancel'));

    expect(queryByTestId('form')).not.toBeInTheDocument();
  });

  it('should not be able to edit a vehicle', async () => {
    const [newVehicle, vehicle, ...rest] = await factory.attrsMany(
      'Vehicle',
      3
    );

    apiMock
      .onGet('vehicles')
      .reply(200, [vehicle, ...rest])
      .onPut(`/vehicles/${vehicle._id}`)
      .reply(400);

    const { getByPlaceholderText, getByTestId } = render(
      <Router history={history}>
        <Vehicles />
      </Router>
    );

    await waitFor(() => getByTestId(`vehicle_${vehicle._id}`));

    fireEvent.click(getByTestId(`vehicle_${vehicle._id}`));
    fireEvent.change(getByPlaceholderText('Modelo'), {
      target: { value: newVehicle.model },
    });
    fireEvent.change(getByPlaceholderText('Tipo'), {
      target: { value: newVehicle.type },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Não foi possivel criar o novo veículo'
    );
  });
});
