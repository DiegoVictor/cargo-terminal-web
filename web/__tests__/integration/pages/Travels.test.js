import React from 'react';
import { render, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { Router } from 'react-router-dom';

import api from '~/services/api';
import history from '~/services/history';
import factory from '../../utils/factory';
import Travels from '~/pages/Travels';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';

const api_mock = new MockAdapter(api);

describe('Travels page', () => {
  it('should be able to list travels', async () => {
    const travel = await factory.attrs('Travel');
    api_mock.onGet('travels').reply(200, [travel]);

    let getByText;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Travels />
        </Router>
      );
      getByText = component.getByText;
    });

    expect(getByText(VehicleTypeTitle(travel.type))).toBeInTheDocument();
    expect(
      getByText(travel.origins[0].reverse().join(', '))
    ).toBeInTheDocument();
    expect(
      getByText(travel.destinations[0].reverse().join(', '))
    ).toBeInTheDocument();
  });
});
