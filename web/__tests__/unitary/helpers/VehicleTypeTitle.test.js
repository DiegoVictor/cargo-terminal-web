import VehicleTypeTitle from '~/helpers/VehicleTypeTitle';

describe('VehicleTypeTitle helper', () => {
  it('should be able to return the label for the types', () => {
    const types = [
      'Caminhão 3/4',
      'Caminhão Toco',
      'Caminhão ​Truck',
      'Carreta Simples',
      'Carreta Eixo Extendido',
    ];

    types.forEach((label, index) => {
      expect(VehicleTypeTitle(index + 1)).toBe(label);
    });
  });
});
