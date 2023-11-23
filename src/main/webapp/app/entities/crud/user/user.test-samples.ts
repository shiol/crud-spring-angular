import dayjs from 'dayjs/esm';

import { IUser, NewUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 18163,
};

export const sampleWithPartialData: IUser = {
  id: 12425,
  firstName: 'Théo',
  email: 'Gael.Barros67@gmail.com',
  login: 'document',
};

export const sampleWithFullData: IUser = {
  id: 29162,
  firstName: 'Natália',
  lastName: 'Silva',
  email: 'Cecilia_Costa@yahoo.com',
  birthday: dayjs('2023-11-22T12:09'),
  login: 'dense amidst limp',
  password: 'adolescent however',
  phone: '+55 (94) 1606-9233',
};

export const sampleWithNewData: NewUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
