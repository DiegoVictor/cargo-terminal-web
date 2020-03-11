import faker from 'faker';

import Vehicle from '../../../src/app/validators/Vehicle';

const next = jest.fn();
const res = {
  status: jest.fn(() => {
    return res;
  }),
  json: jest.fn(response => response),
};

describe('Vehicle validator', () => {
  it('should be able to pass in validation', async () => {
    const type = faker.random.number({ min: 1, ma: 5 });
    const model = faker.random.word();

    await Vehicle({ body: { type, model } }, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should be able to fail in validation', async () => {
    await Vehicle({ body: {} }, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Validation fails',
        details: expect.any(Array),
      },
    });
  });
});
