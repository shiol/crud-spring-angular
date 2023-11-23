import { ICarro, NewCarro } from './carro.model';

export const sampleWithRequiredData: ICarro = {
  id: 3392,
};

export const sampleWithPartialData: ICarro = {
  id: 19452,
  model: 'dimly',
  color: 'gold',
};

export const sampleWithFullData: ICarro = {
  id: 21145,
  year: 22665,
  licensePlate: 'but redhead',
  model: 'cupcake whether',
  color: 'orange',
};

export const sampleWithNewData: NewCarro = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
