import factory from 'factory-girl';
import faker from 'faker';

factory.define('Driver', {}, async () => {
  const vehicle = await factory.attrs('Vehicle');
  return {
    _id: faker.random.uuid,
    name: faker.name.findName,
    cpf: () =>
      String(faker.random.number({ min: 11111111111, max: 99999999999 })),
    phone: faker.phone.phoneNumber,
    birthday: () => faker.date.past().toLocaleString(),
    cnh_number: () =>
      String(faker.random.number({ min: 11111111111, max: 99999999999 })),
    cnh_type: () => faker.random.arrayElement(['A', 'B', 'C', 'D', 'E']),
    gender: () => faker.random.arrayElement(['F', 'M', 'O']),
    vehicle,
  };
});

factory.define(
  'Vehicle',
  {},
  {
    _id: faker.random.uuid,
    model: faker.name.findName,
    type: () => faker.random.arrayElement([1, 2, 3, 4, 5]),
  }
);

factory.define(
  'Travel',
  {},
  {
    origins: () => [[faker.address.longitude(), faker.address.latitude()]],
    destinations: () => [[faker.address.longitude(), faker.address.latitude()]],
    type: () => faker.random.arrayElement([1, 2, 3, 4, 5]),
  }
);

factory.define('Arrival', {}, async () => {
  const driver = await factory.attrs('Driver');
  const vehicle = await factory.attrs('Vehicle');

  return {
    _id: faker.random.uuid,
    filled: faker.random.boolean,
    driver,
    vehicle,
    origin: () => [faker.address.longitude(), faker.address.latitude()],
    destination: () => [faker.address.longitude(), faker.address.latitude()],
    createdAt: faker.date.past,
  };
});

export default factory;
