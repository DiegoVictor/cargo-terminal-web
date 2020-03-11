import Mongoose from 'mongoose';
import faker from 'faker';

import factory from '../../utils/factories';
import Arrival from '../../../src/app/models/Arrival';
import Driver from '../../../src/app/models/Driver';
import Vehicle from '../../../src/app/models/Vehicle';
import Controller from '../../../src/app/controllers/ArrivalController';

const res = {
  status: jest.fn(() => {
    return res;
  }),
  json: jest.fn(response => response),
};

describe('Arrival controller', () => {
  beforeAll(async () => {
    await Mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  });

  beforeEach(async () => {
    await Arrival.deleteMany();
    await Driver.deleteMany();
    await Vehicle.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of arrivals', async () => {
    let arrivals = await factory.createMany('Arrival', 3);

    const response = await Controller.index({ query: {} }, res);

    arrivals = arrivals.map(a => a.toObject());
    response.forEach(arrival => {
      expect(arrivals).toContainEqual(arrival.toObject());
    });
  });

  it('should be able to get a list of arrivals filtered by filled', async () => {
    let arrivals = await factory.createMany('Arrival', 3);

    const response = await Controller.index({ query: { filled: 1 } }, res);

    arrivals = arrivals.map(a => a.toObject());
    response.forEach(arrival => {
      expect(arrival.filled).toBeTruthy();
      expect(arrivals).toContainEqual(arrival.toObject());
    });
  });

  it('should be able to get a list of arrivals filtered by date', async () => {
    let arrivals = await factory.createMany('Arrival', 3);

    const response = await Controller.index(
      {
        query: {
          date_start: faker.date.past().toISOString(),
          date_end: faker.date.future().toISOString(),
        },
      },
      res
    );

    arrivals = arrivals.map(a => a.toObject());
    response.forEach(arrival => {
      expect(arrivals).toContainEqual(arrival.toObject());
    });
  });

  it('should be able to get a list of arrivals filtered by end date', async () => {
    let arrivals = await factory.createMany('Arrival', 3);
    const date_end = faker.date.future().toISOString();

    const response = await Controller.index(
      {
        query: { date_end },
      },
      res
    );

    arrivals = arrivals.map(a => a.toObject());
    response.forEach(arrival => {
      expect(arrival.createdAt < new Date(date_end)).toBe(true);
      expect(arrivals).toContainEqual(arrival.toObject());
    });
  });

  it('should be able to store a new arrival', async () => {
    const driver = await factory.create('Driver');
    const vehicle = await factory.create('Vehicle');
    const origin = {
      latitude: Number(faker.address.latitude()),
      longitude: Number(faker.address.longitude()),
    };
    const destination = {
      latitude: Number(faker.address.latitude()),
      longitude: Number(faker.address.longitude()),
    };
    const arrival = await factory.attrs('Arrival', {
      driver_id: driver._id,
      vehicle_id: vehicle._id,
      origin,
      destination,
    });

    const response = await Controller.store({ body: arrival }, res);

    expect(response.toObject()).toMatchObject({
      origin: [origin.longitude, origin.latitude],
      destination: [destination.longitude, destination.latitude],
      driver: {
        ...driver.toObject(),
        vehicle: driver.vehicle,
      },
      vehicle: { ...vehicle.toObject() },
    });
  });

  it('should not be able to store a new arrival with a vehicle that not exists', async () => {
    const driver = await factory.create('Driver');
    const vehicle = await factory.create('Vehicle');
    const origin = {
      latitude: Number(faker.address.latitude()),
      longitude: Number(faker.address.longitude()),
    };
    const destination = {
      latitude: Number(faker.address.latitude()),
      longitude: Number(faker.address.longitude()),
    };
    const arrival = await factory.attrs('Arrival', {
      driver_id: driver._id,
      vehicle_id: vehicle._id,
      origin,
      destination,
    });

    await vehicle.delete();

    await Controller.store({ body: arrival }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Vehicle not found',
      },
    });
  });

  it('should not be able to store a new arrival with a driver that not exists', async () => {
    const driver = await factory.create('Driver');
    const vehicle = await factory.create('Vehicle');
    const origin = {
      latitude: Number(faker.address.latitude()),
      longitude: Number(faker.address.longitude()),
    };
    const destination = {
      latitude: Number(faker.address.latitude()),
      longitude: Number(faker.address.longitude()),
    };
    const arrival = await factory.attrs('Arrival', {
      driver_id: driver._id,
      vehicle_id: vehicle._id,
      origin,
      destination,
    });

    await driver.delete();

    await Controller.store({ body: arrival }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Driver not found',
      },
    });
  });

  it('should not be able to update an arrival with a vehicle that not exists', async () => {
    const driver = await factory.create('Driver');
    const [vehicle, not_exists_vehicle] = await factory.createMany(
      'Vehicle',
      2
    );
    const origin = [
      Number(faker.address.latitude()),
      Number(faker.address.longitude()),
    ];
    const destination = [
      Number(faker.address.latitude()),
      Number(faker.address.longitude()),
    ];
    const arrival = await factory.create('Arrival', {
      driver: driver._id,
      vehicle: vehicle._id,
      origin,
      destination,
    });
    await not_exists_vehicle.delete();
    await Controller.update(
      {
        params: { id: arrival._id },
        body: {
          vehicle_id: not_exists_vehicle._id,
          driver_id: driver._id,
        },
      },
      res
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Vehicle not found',
      },
    });
  });

  it('should not be able to update an arrival with a driver that not exists', async () => {
    const [driver, not_exists_driver] = await factory.createMany('Driver', 2);
    const vehicle = await factory.create('Vehicle');
    const origin = [
      Number(faker.address.latitude()),
      Number(faker.address.longitude()),
    ];
    const destination = [
      Number(faker.address.latitude()),
      Number(faker.address.longitude()),
    ];
    const arrival = await factory.create('Arrival', {
      driver: driver._id,
      vehicle: vehicle._id,
      origin,
      destination,
    });

    await not_exists_driver.delete();

    await Controller.update(
      {
        params: { id: arrival._id },
        body: {
          ...arrival,
          vehicle_id: vehicle._id,
          driver_id: not_exists_driver._id,
        },
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Driver not found',
      },
    });
  });

  it('should not be able to update an arrival that not exists', async () => {
    const driver = await factory.create('Driver');
    const vehicle = await factory.create('Vehicle');
    const origin = [
      Number(faker.address.latitude()),
      Number(faker.address.longitude()),
    ];
    const destination = [
      Number(faker.address.latitude()),
      Number(faker.address.longitude()),
    ];
    const arrival = await factory.create('Arrival', {
      driver: driver._id,
      vehicle: vehicle._id,
      origin,
      destination,
    });

    await arrival.delete();

    await Controller.update(
      {
        params: { id: arrival._id },
        body: {
          ...arrival,
          vehicle_id: vehicle._id,
          driver_id: driver._id,
        },
      },
      res
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Arrival not found',
      },
    });
  });

  it('should be able to update an arrival', async () => {
    const [driver, new_driver] = await factory.createMany('Driver', 2);
    const vehicle = await factory.create('Vehicle');
    const origin = [
      Number(faker.address.longitude()),
      Number(faker.address.latitude()),
    ];
    const destination = [
      Number(faker.address.longitude()),
      Number(faker.address.latitude()),
    ];
    const arrival = await factory.create('Arrival', {
      driver: driver._id,
      vehicle: vehicle._id,
      origin,
      destination,
    });

    const response = await Controller.update(
      {
        params: { id: arrival._id },
        body: {
          driver_id: new_driver._id,
          filled: !arrival.filled,
          origin: {
            latitude: origin[1],
            longitude: origin[0],
          },
          destination: {
            latitude: destination[1],
            longitude: destination[0],
          },
        },
      },
      res
    );

    expect({
      ...response.toObject(),
      driver: {
        ...response.driver.toObject(),
        _id: response.driver._id.toString(),
      },
    }).toMatchObject({
      origin,
      destination,
      driver: {
        ...new_driver.toObject(),
        _id: new_driver._id.toString(),
      },
      vehicle: vehicle._id,
    });
  });
});
