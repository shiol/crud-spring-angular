import dayjs from 'dayjs/esm';

export interface IUser {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  birthday?: dayjs.Dayjs | null;
  login?: string | null;
  password?: string | null;
  phone?: string | null;
}

export type NewUser = Omit<IUser, 'id'> & { id: null };
