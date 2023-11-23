export interface ICar {
  id: number;
  year?: number | null;
  licensePlate?: string | null;
  model?: string | null;
  color?: string | null;
}

export type NewCar = Omit<ICar, 'id'> & { id: null };
