import faker from 'faker';

import factory from '../../utils/factories';
import Driver from '../../../src/app/validators/Driver';

const next = jest.fn();
const res = {
  status: jest.fn(() => {
    return res;
  }),
  json: jest.fn(),
};

describe('Driver validator', () => {
  it('should be able to pass in validation', async () => {
    const vehicle = await factory.attrs('Vehicle', {
      _id: faker.random.uuid(),
    });
    const driver = await factory.attrs('Driver', { vehicles: [vehicle] });

    await Driver({ body: driver }, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should be able to fail in validation', async () => {
    await Driver({ body: {} }, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Validation fails',
        details: expect.any(Array),
      },
    });
  });
});
