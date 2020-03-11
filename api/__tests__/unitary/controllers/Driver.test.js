import Mongoose from 'mongoose';

import factory from '../../utils/factories';
import Driver from '../../../src/app/models/Driver';
import Vehicle from '../../../src/app/models/Vehicle';
import Controller from '../../../src/app/controllers/DriverController';

const res = {
  status: jest.fn(() => {
    return res;
  }),
  json: jest.fn(response => response),
};

describe('Driver controller', () => {
  beforeAll(async () => {
    await Mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  });

  beforeEach(async () => {
    await Driver.deleteMany();
    await Vehicle.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of drivers', async () => {
    let drivers = await factory.createMany('Driver', 3);

    const response = await Controller.index({ query: {} }, res);

    drivers = drivers.map(d => d.toObject());
    response.forEach(driver => {
      expect(drivers).toContainEqual(driver.toObject());
    });
  });

  it('should be able to get a list of drivers filtered by vehicle', async () => {
    const vehicle = await factory.create('Vehicle');
    const drivers = await factory.createMany('Driver', 2, {
      vehicles: [vehicle],
    });

    const response = await Controller.index({ query: { vehicle: '1' } }, res);

    response.forEach(driver => {
      expect(driver.vehicles.map(v => v._id.toString())).toContainEqual(
        vehicle._id.toString()
      );

      expect(
        drivers.map(d => {
          return {
            ...d.toObject(),
            vehicles: d.vehicles.map(v => v._id),
          };
        })
      ).toContainEqual(driver.toObject());
    });
  });

  it('should be able to get a list of drivers filtered by active', async () => {
    await factory.create('Driver', { active: false });
    await factory.createMany('Driver', 3);
    const response = await Controller.index({ query: { active: '1' } }, res);

    response.forEach(driver => {
      expect(driver.active).toBe(true);
    });
  });

  it('should be able to store a new driver', async () => {
    const vehicle = await factory.create('Vehicle');
    const driver = await factory.attrs('Driver', { vehicle: vehicle._id });

    const response = await Controller.store({ body: driver }, res);

    expect({
      ...response.toObject(),
      vehicle: response.vehicle.toString(),
    }).toMatchObject({
      ...driver,
      vehicle: driver.vehicle.toString(),
    });
  });

  it('should not be able to store a new driver with a vehicle that not exists', async () => {
    const vehicle = await factory.create('Vehicle');
    const driver = await factory.attrs('Driver', { vehicle: vehicle._id });

    await vehicle.delete();

    await Controller.store({ body: driver }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Vehicle not found',
      },
    });
  });

  it('should be able to update a driver', async () => {
    const vehicle = await factory.create('Vehicle');
    const driver = await factory.create('Driver');
    const new_driver_data = await factory.attrs('Driver');

    const response = await Controller.update(
      {
        params: { id: driver._id },
        body: { ...new_driver_data, vehicle: vehicle._id },
      },
      res
    );

    expect({
      ...response.toObject(),
      vehicle: response.vehicle.toString(),
    }).toMatchObject({
      ...new_driver_data,
      vehicle: vehicle._id.toString(),
    });
  });

  it('should be not able to update a driver that not exists', async () => {
    const vehicle = await factory.create('Vehicle');
    const driver = await factory.create('Driver');
    const new_driver_data = await factory.attrs('Driver');

    await driver.delete();

    await Controller.update(
      {
        params: { id: driver._id },
        body: { ...new_driver_data, vehicles: [vehicle._id] },
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Driver not found',
      },
    });
  });

  it('should be not able to update a driver with a vehicle that not exists', async () => {
    const vehicle = await factory.create('Vehicle');
    const driver = await factory.create('Driver');
    const new_driver_data = await factory.attrs('Driver');

    await vehicle.delete();

    await Controller.update(
      {
        params: { id: driver._id },
        body: { ...new_driver_data, vehicle: vehicle._id },
      },
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
