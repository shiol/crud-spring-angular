import dayjs from 'dayjs/esm';

export interface IUsuario {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  birthday?: dayjs.Dayjs | null;
  login?: string | null;
  password?: string | null;
  phone?: string | null;
}

export type NewUsuario = Omit<IUsuario, 'id'> & { id: null };
