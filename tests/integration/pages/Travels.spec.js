import React from 'react';
import { render, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router';

import api from '~/services/api';
import Travels from '~/pages/Travels';
import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';
import factory from '../../utils/factory';

const apiMock = new MockAdapter(api);

describe('Travels page', () => {
  it('should be able to list travels', async () => {
    const travel = await factory.attrs('Travel');
    apiMock.onGet('travels').reply(200, [travel]);

    let getByText;
    await act(async () => {
      const component = render(
        <MemoryRouter>
          <Travels />
        </MemoryRouter>
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
