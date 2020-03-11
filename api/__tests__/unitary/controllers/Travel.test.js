import Mongoose from 'mongoose';

import factory from '../../utils/factories';
import Arrival from '../../../src/app/models/Arrival';
import Driver from '../../../src/app/models/Driver';
import Vehicle from '../../../src/app/models/Vehicle';
import Controller from '../../../src/app/controllers/TravelController';

const res = {
  json: jest.fn(response => response),
};

describe('Travel controller', () => {
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
    await Arrival.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be return a list of origins and destinations grouped by type', async () => {
    const { _id: driver } = await factory.create('Driver');
    const vehicles = await factory.createMany('Vehicle', 2, [
      { type: 1 },
      { type: 2 },
    ]);
    const arrivals = await factory.createMany('Arrival', 4, [
      {
        vehicle: vehicles[0]._id,
        driver,
      },
      {
        vehicle: vehicles[1]._id,
        driver,
      },
      {
        vehicle: vehicles[0]._id,
        driver,
      },
      {
        vehicle: vehicles[1]._id,
        driver,
      },
    ]);

    const response = await Controller.index({}, res);

    expect(res.json).toHaveBeenCalled();
    response.forEach((group, index) => {
      const arrivals_same_type = arrivals.filter(
        a => a.vehicle === vehicles[index]._id
      );

      expect(group.origins).toEqual(
        arrivals_same_type.map(arrival => {
          return [...arrival.origin];
        })
      );
      expect(group.destinations).toEqual(
        arrivals_same_type.map(arrival => {
          return [...arrival.destination];
        })
      );
    });
  });
});
