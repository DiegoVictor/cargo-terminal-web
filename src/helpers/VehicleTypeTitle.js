export default (type) => {
  const types = {
    1: 'Caminhão 3/4',
    2: 'Caminhão Toco',
    3: 'Caminhão ​Truck',
    4: 'Carreta Simples',
    5: 'Carreta Eixo Extendido',
  };

  return types[type];
};
