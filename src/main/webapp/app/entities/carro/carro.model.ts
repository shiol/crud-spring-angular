import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface ICarro {
  id: number;
  year?: number | null;
  licensePlate?: string | null;
  model?: string | null;
  color?: string | null;
  usuario?: Pick<IUsuario, 'id'> | null;
}

export type NewCarro = Omit<ICarro, 'id'> & { id: null };
