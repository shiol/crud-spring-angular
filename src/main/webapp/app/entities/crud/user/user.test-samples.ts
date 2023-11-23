import dayjs from 'dayjs/esm';

import { IUser, NewUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 16017,
};

export const sampleWithPartialData: IUser = {
  id: 368,
  lastName: 'Souza',
  login: 'bravely arctic like',
  phone: '(93) 76581-1027',
};

export const sampleWithFullData: IUser = {
  id: 16799,
  firstName: 'Tertuliano',
  lastName: 'Melo',
  email: 'Warley.Braga52@bol.com.br',
  birthday: dayjs('2023-11-22T11:31'),
  login: 'shrilly wise',
  password: 'interestingly geez',
  phone: '(11) 0118-0506',
};

export const sampleWithNewData: NewUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
