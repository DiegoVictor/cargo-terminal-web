import faker from 'faker';

import factory from '../../utils/factories';
import Arrival from '../../../src/app/validators/Arrival';

const next = jest.fn();
const res = {
  status: jest.fn(() => {
    return res;
  }),
  json: jest.fn(),
};

describe('Arrival validator', () => {
  it('should be able to pass in validation', async () => {
    const driver_id = faker.random.uuid();
    const vehicle_id = faker.random.uuid();

    const arrival = await factory.attrs('Arrival', {
      driver_id,
      vehicle_id,
      origin: {
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      },
      destination: {
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      },
    });

    await Arrival({ body: arrival }, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should be able to fail in validation', async () => {
    const driver_id = faker.random.uuid();
    const arrival = await factory.attrs('Arrival', { driver_id });

    await Arrival({ body: arrival }, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Validation fails',
        details: expect.any(Array),
      },
    });
  });
});
