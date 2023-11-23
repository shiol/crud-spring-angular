import { ICar, NewCar } from './car.model';

export const sampleWithRequiredData: ICar = {
  id: 16593,
};

export const sampleWithPartialData: ICar = {
  id: 11377,
  model: 'when rural',
  color: 'marrom',
};

export const sampleWithFullData: ICar = {
  id: 21140,
  year: 21667,
  licensePlate: 'pro survey yuck',
  model: 'ugh schlepp',
  color: 'cinza',
};

export const sampleWithNewData: NewCar = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
