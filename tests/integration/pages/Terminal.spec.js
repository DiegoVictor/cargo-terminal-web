import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';
import Terminal from '~/pages/Terminal';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';
import factory from '../../utils/factory';

const apiMock = new MockAdapter(api);

jest.mock('react-toastify');
toast.error = jest.fn();

jest.mock('react-datepicker', () => {
  return {
    __esModule: true,
    // eslint-disable-next-line react/prop-types
    default: function DatePicker({
      className,
      onChange,
      'data-testid': testId,
    }) {
      return (
        <input
          name="fake-input"
          type="text"
          className={className}
          data-testid={testId}
          onChange={onChange}
        />
      );
    },
  };
});

describe('Terminal page', () => {
  it('should be able to list all arrivals', async () => {
    const drivers = await factory.attrsMany('Driver', 3);
    const vehicles = await factory.attrsMany('Vehicle', 3);
    const arrivals = await factory.attrsMany('Arrival', 3);

    apiMock
      .onGet('drivers')
      .reply(200, drivers)
      .onGet('vehicles')
      .reply(200, vehicles)
      .onGet('arrivals')
      .reply(200, arrivals);

    let getByTestId;
    let getByText;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Terminal />
        </Router>
      );
      getByTestId = component.getByTestId;
      getByText = component.getByText;
    });

    arrivals.forEach((arrival) => {
      expect(getByText(arrival.driver.name)).toBeInTheDocument();
      expect(
        getByText(
          `${arrival.vehicle.model} (${VehicleTypeTitle(arrival.vehicle.type)})`
        )
      ).toBeInTheDocument();
      expect(getByTestId(`arrival_filled_${arrival._id}`)).toBeInTheDocument();
      expect(getByText(arrival.origin.join(', '))).toBeInTheDocument();
      expect(getByText(arrival.destination.join(', '))).toBeInTheDocument();
    });
  });

  it('should be able to list all arrivals in a date range', async () => {
    const drivers = await factory.attrsMany('Driver', 3);
    const vehicles = await factory.attrsMany('Vehicle', 3);
    const arrivals = await factory.attrsMany('Arrival', 3);

    arrivals[2].createdAt = new Date('03/09/2020');

    const dateStart = new Date('03/09/2020');
    const dateEnd = new Date('03/10/2020');

    apiMock
      .onGet('drivers')
      .reply(200, drivers)
      .onGet('vehicles')
      .reply(200, vehicles)
      .onGet('arrivals', {
        params: { date_start: dateStart, date_end: dateEnd },
      })
      .reply(200, [arrivals[2]])
      .onGet('arrivals')
      .reply(200, arrivals);

    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Terminal />
        </Router>
      );
      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.change(getByTestId('start'), {
        target: { value: dateStart },
      });
    });

    await act(async () => {
      fireEvent.change(getByTestId('end'), {
        target: { value: dateEnd },
      });
    });

    expect(getByTestId(`arrival_${arrivals[2]._id}`)).toBeInTheDocument();
  });

  it('should be able to create an arrival', async () => {
    const driver = await factory.attrs('Driver');
    const vehicle = await factory.attrs('Vehicle');
    const [arrival, newArrival] = await factory.attrsMany('Arrival', 2);

    apiMock
      .onGet('drivers')
      .reply(200, [driver])
      .onGet('vehicles')
      .reply(200, [vehicle])
      .onGet('arrivals')
      .reply(200, [arrival])
      .onPost('arrivals')
      .reply(200, { ...newArrival, driver, vehicle });

    let getByText;
    let getByTestId;
    let getByPlaceholderText;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Terminal />
        </Router>
      );
      getByText = component.getByText;
      getByTestId = component.getByTestId;
      getByPlaceholderText = component.getByPlaceholderText;
    });

    fireEvent.click(getByTestId('new'));
    fireEvent.change(getByPlaceholderText('Motorista'), {
      target: {
        value: driver._id,
      },
    });
    fireEvent.change(getByPlaceholderText('Veículo'), {
      target: {
        value: vehicle._id,
      },
    });
    fireEvent.change(getByPlaceholderText('Carregado'), {
      target: {
        value: newArrival.filled ? 1 : 0,
      },
    });
    fireEvent.change(getByTestId('latitude_origin'), {
      target: {
        value: newArrival.origin[1],
      },
    });
    fireEvent.change(getByTestId('longitude_origin'), {
      target: {
        value: newArrival.origin[0],
      },
    });
    fireEvent.change(getByTestId('latitude_destination'), {
      target: {
        value: newArrival.destination[1],
      },
    });
    fireEvent.change(getByTestId('longitude_destination'), {
      target: {
        value: newArrival.destination[0],
      },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(
      getByTestId(`arrival_driver_name_${newArrival._id}`)
    ).toBeInTheDocument();
    expect(
      getByTestId(`arrival_vehicle_model_${newArrival._id}`)
    ).toBeInTheDocument();
    expect(getByTestId(`arrival_filled_${newArrival._id}`)).toBeInTheDocument();
    expect(getByText(newArrival.origin.join(', '))).toBeInTheDocument();
    expect(getByText(newArrival.destination.join(', '))).toBeInTheDocument();
  });

  it('should not be able to create an arrival', async () => {
    const driver = await factory.attrs('Driver');
    const vehicle = await factory.attrs('Vehicle');
    const [arrival, newArrival] = await factory.attrsMany('Arrival', 2);

    apiMock
      .onGet('drivers')
      .reply(200, [driver])
      .onGet('vehicles')
      .reply(200, [vehicle])
      .onGet('arrivals')
      .reply(200, [arrival])
      .onPost('arrivals')
      .reply(400);

    let getByTestId;
    let getByPlaceholderText;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Terminal />
        </Router>
      );
      getByTestId = component.getByTestId;
      getByPlaceholderText = component.getByPlaceholderText;
    });

    fireEvent.click(getByTestId('new'));
    fireEvent.change(getByPlaceholderText('Motorista'), {
      target: {
        value: driver._id,
      },
    });
    fireEvent.change(getByPlaceholderText('Veículo'), {
      target: {
        value: vehicle._id,
      },
    });
    fireEvent.change(getByPlaceholderText('Carregado'), {
      target: {
        value: newArrival.filled ? 1 : 0,
      },
    });
    fireEvent.change(getByTestId('latitude_origin'), {
      target: {
        value: newArrival.origin[1],
      },
    });
    fireEvent.change(getByTestId('longitude_origin'), {
      target: {
        value: newArrival.origin[0],
      },
    });
    fireEvent.change(getByTestId('latitude_destination'), {
      target: {
        value: newArrival.destination[1],
      },
    });
    fireEvent.change(getByTestId('longitude_destination'), {
      target: {
        value: newArrival.destination[0],
      },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Não foi possivel criar o novo registro'
    );
  });

  it('should be able to edit an arrival', async () => {
    const driver = await factory.attrs('Driver');
    const vehicle = await factory.attrs('Vehicle');
    const [arrival, newArrival, ...rest] = await factory.attrsMany(
      'Arrival',
      3
    );

    apiMock
      .onGet('drivers')
      .reply(200, [driver])
      .onGet('vehicles')
      .reply(200, [vehicle])
      .onGet('arrivals')
      .reply(200, [arrival, ...rest])
      .onPut(`/arrivals/${arrival._id}`)
      .reply(200, { ...newArrival, driver, vehicle, _id: arrival._id });

    let getByText;
    let getByTestId;
    let getByPlaceholderText;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Terminal />
        </Router>
      );
      getByText = component.getByText;
      getByTestId = component.getByTestId;
      getByPlaceholderText = component.getByPlaceholderText;
    });

    fireEvent.click(getByTestId(`arrival_edit_${arrival._id}`));
    fireEvent.change(getByPlaceholderText('Motorista'), {
      target: {
        value: driver._id,
      },
    });
    fireEvent.change(getByPlaceholderText('Veículo'), {
      target: {
        value: vehicle._id,
      },
    });
    fireEvent.change(getByPlaceholderText('Carregado'), {
      target: {
        value: newArrival.filled ? 1 : 0,
      },
    });
    fireEvent.change(getByTestId('latitude_origin'), {
      target: {
        value: newArrival.origin[1],
      },
    });
    fireEvent.change(getByTestId('longitude_origin'), {
      target: {
        value: newArrival.origin[0],
      },
    });
    fireEvent.change(getByTestId('latitude_destination'), {
      target: {
        value: newArrival.destination[1],
      },
    });
    fireEvent.change(getByTestId('longitude_destination'), {
      target: {
        value: newArrival.destination[0],
      },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(
      getByTestId(`arrival_driver_name_${arrival._id}`)
    ).toBeInTheDocument();
    expect(
      getByTestId(`arrival_vehicle_model_${arrival._id}`)
    ).toBeInTheDocument();
    expect(getByTestId(`arrival_filled_${arrival._id}`)).toBeInTheDocument();
    expect(getByText(newArrival.origin.join(', '))).toBeInTheDocument();
    expect(getByText(newArrival.destination.join(', '))).toBeInTheDocument();
  });

  it('should be able to cancel the vehicle edition', async () => {
    const driver = await factory.attrs('Driver');
    const vehicle = await factory.attrs('Vehicle');
    const arrival = await factory.attrs('Arrival');

    apiMock
      .onGet('drivers')
      .reply(200, [driver])
      .onGet('vehicles')
      .reply(200, [vehicle])
      .onGet('arrivals')
      .reply(200, [arrival]);

    let getByTestId;
    let queryByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Terminal />
        </Router>
      );

      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    fireEvent.click(getByTestId(`arrival_edit_${arrival._id}`));
    expect(getByTestId('form')).toBeInTheDocument();

    fireEvent.click(getByTestId('cancel'));

    expect(queryByTestId('form')).not.toBeInTheDocument();
  });
});
