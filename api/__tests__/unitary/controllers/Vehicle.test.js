import Mongoose from 'mongoose';

import factory from '../../utils/factories';
import Vehicle from '../../../src/app/models/Vehicle';
import Controller from '../../../src/app/controllers/VehicleController';

const res = {
  status: jest.fn(() => {
    return res;
  }),
  json: jest.fn(response => response),
};

describe('Vehicle controller', () => {
  beforeAll(async () => {
    await Mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  });

  beforeEach(async () => {
    await Vehicle.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of vehicles', async () => {
    const vehicles = await factory.createMany('Vehicle', 3);

    const response = await Controller.index({}, res);

    expect(response.map(v => v.toObject())).toStrictEqual(
      vehicles.map(v => v.toObject())
    );
  });

  it('should be able to store a new vehicle', async () => {
    const { type } = await factory.attrs('Vehicle');

    await Controller.store({ body: { type } }, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ type }));
  });

  it('should be able to update a vehicle', async () => {
    const { _id: id } = await factory.create('Vehicle');
    const { type } = await factory.attrs('Vehicle');

    await Controller.update({ params: { id }, body: { type } }, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ type }));
  });

  it('should not be able to update a vehicle that not exists', async () => {
    const vehicle = await factory.create('Vehicle');
    const { type } = await factory.attrs('Vehicle');

    await vehicle.delete();

    await Controller.update(
      { params: { id: vehicle._id }, body: { type } },
      res
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Vehicle not found',
      },
    });
  });
});
