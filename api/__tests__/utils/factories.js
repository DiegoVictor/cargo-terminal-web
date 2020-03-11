import factory from 'factory-girl';
import faker from 'faker';

import Arrival from '../../src/app/models/Arrival';
import Driver from '../../src/app/models/Driver';
import Vehicle from '../../src/app/models/Vehicle';

factory.define('Vehicle', Vehicle, {
  type: () => faker.random.number({ min: 1, max: 5 }),
});

factory.define('Driver', Driver, {
  cpf: () =>
    String(faker.random.number({ min: 111111111111, max: 999999999999 })),
  name: faker.name.findName,
  phone: faker.phone.phoneNumber,
  birthday: () => faker.date.past().toString(),
  gender: () => faker.random.arrayElement(['F', 'M']),
  vehicle: null,
  cnh_number: () =>
    String(faker.random.number({ min: 11111111111, max: 99999999999 })),
  cnh_type: faker.random.arrayElement(['A', 'B', 'C', 'D', 'E']),
});

factory.define('Arrival', Arrival, {
  filled: faker.random.boolean,
  driver: null,
  vehicle: null,
  origin: () => [
    Number(faker.address.longitude()),
    Number(faker.address.latitude()),
  ],
  destination: () => [
    Number(faker.address.longitude()),
    Number(faker.address.latitude()),
  ],
});

export default factory;
