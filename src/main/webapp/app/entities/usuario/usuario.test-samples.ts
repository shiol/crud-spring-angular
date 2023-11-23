import dayjs from 'dayjs/esm';

import { IUsuario, NewUsuario } from './usuario.model';

export const sampleWithRequiredData: IUsuario = {
  id: 319,
};

export const sampleWithPartialData: IUsuario = {
  id: 13047,
  firstName: 'Graciela',
  lastName: 'Sanford',
  email: 'Shannon.Dooley@hotmail.com',
  birthday: dayjs('2023-11-23T07:16'),
  login: 'icky',
};

export const sampleWithFullData: IUsuario = {
  id: 26876,
  firstName: 'Shanny',
  lastName: 'Blick',
  email: 'Burnice4@yahoo.com',
  birthday: dayjs('2023-11-23T00:05'),
  login: 'jovially inconsequential across',
  password: 'punctually far ugh',
  phone: '552-750-9114 x4733',
};

export const sampleWithNewData: NewUsuario = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
