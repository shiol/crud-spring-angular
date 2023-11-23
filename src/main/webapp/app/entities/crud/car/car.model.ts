import { IUser } from 'app/entities/crud/user/user.model';

export interface ICar {
  id: number;
  year?: number | null;
  licensePlate?: string | null;
  model?: string | null;
  color?: string | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewCar = Omit<ICar, 'id'> & { id: null };
