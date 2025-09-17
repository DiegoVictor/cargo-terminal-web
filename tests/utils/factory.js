import factory from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define('Driver', {}, async () => {
  const vehicle = await factory.attrs('Vehicle');
  return {
    _id: faker.string.uuid,
    name: faker.person.firstName,
    cpf: () => String(faker.number.int({ min: 11111111111, max: 99999999999 })),
    phone: faker.phone.number,
    birthday: () => faker.date.past().toLocaleString(),
    cnh_number: () =>
      String(faker.number.int({ min: 11111111111, max: 99999999999 })),
    cnh_type: () => faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
    gender: () => faker.helpers.arrayElement(['F', 'M', 'O']),
    vehicle,
  };
});

factory.define(
  'Vehicle',
  {},
  {
    _id: faker.string.uuid,
    model: () =>
      `${faker.vehicle.model()} ${faker.number.int({
        min: 2000,
        max: 3000,
      })}`,
    type: () => faker.helpers.arrayElement([1, 2, 3, 4, 5]),
  }
);

factory.define(
  'Travel',
  {},
  {
    origins: () => [[faker.location.longitude(), faker.location.latitude()]],
    destinations: () => [
      [faker.location.longitude(), faker.location.latitude()],
    ],
    type: () => faker.helpers.arrayElement([1, 2, 3, 4, 5]),
  }
);

factory.define('Arrival', {}, async () => {
  const driver = await factory.attrs('Driver');
  const vehicle = await factory.attrs('Vehicle');

  return {
    _id: faker.string.uuid,
    filled: faker.datatype.boolean,
    driver,
    vehicle,
    origin: () => [faker.location.longitude(), faker.location.latitude()],
    destination: () => [faker.location.longitude(), faker.location.latitude()],
    createdAt: faker.date.past,
  };
});

export default factory;
