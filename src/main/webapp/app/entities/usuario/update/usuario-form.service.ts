import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUsuario, NewUsuario } from '../usuario.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUsuario for edit and NewUsuarioFormGroupInput for create.
 */
type UsuarioFormGroupInput = IUsuario | PartialWithRequiredKeyOf<NewUsuario>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUsuario | NewUsuario> = Omit<T, 'birthday'> & {
  birthday?: string | null;
};

type UsuarioFormRawValue = FormValueOf<IUsuario>;

type NewUsuarioFormRawValue = FormValueOf<NewUsuario>;

type UsuarioFormDefaults = Pick<NewUsuario, 'id' | 'birthday'>;

type UsuarioFormGroupContent = {
  id: FormControl<UsuarioFormRawValue['id'] | NewUsuario['id']>;
  firstName: FormControl<UsuarioFormRawValue['firstName']>;
  lastName: FormControl<UsuarioFormRawValue['lastName']>;
  email: FormControl<UsuarioFormRawValue['email']>;
  birthday: FormControl<UsuarioFormRawValue['birthday']>;
  login: FormControl<UsuarioFormRawValue['login']>;
  password: FormControl<UsuarioFormRawValue['password']>;
  phone: FormControl<UsuarioFormRawValue['phone']>;
};

export type UsuarioFormGroup = FormGroup<UsuarioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UsuarioFormService {
  createUsuarioFormGroup(usuario: UsuarioFormGroupInput = { id: null }): UsuarioFormGroup {
    const usuarioRawValue = this.convertUsuarioToUsuarioRawValue({
      ...this.getFormDefaults(),
      ...usuario,
    });
    return new FormGroup<UsuarioFormGroupContent>({
      id: new FormControl(
        { value: usuarioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      firstName: new FormControl(usuarioRawValue.firstName),
      lastName: new FormControl(usuarioRawValue.lastName),
      email: new FormControl(usuarioRawValue.email),
      birthday: new FormControl(usuarioRawValue.birthday),
      login: new FormControl(usuarioRawValue.login),
      password: new FormControl(usuarioRawValue.password),
      phone: new FormControl(usuarioRawValue.phone),
    });
  }

  getUsuario(form: UsuarioFormGroup): IUsuario | NewUsuario {
    return this.convertUsuarioRawValueToUsuario(form.getRawValue() as UsuarioFormRawValue | NewUsuarioFormRawValue);
  }

  resetForm(form: UsuarioFormGroup, usuario: UsuarioFormGroupInput): void {
    const usuarioRawValue = this.convertUsuarioToUsuarioRawValue({ ...this.getFormDefaults(), ...usuario });
    form.reset(
      {
        ...usuarioRawValue,
        id: { value: usuarioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UsuarioFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      birthday: currentTime,
    };
  }

  private convertUsuarioRawValueToUsuario(rawUsuario: UsuarioFormRawValue | NewUsuarioFormRawValue): IUsuario | NewUsuario {
    return {
      ...rawUsuario,
      birthday: dayjs(rawUsuario.birthday, DATE_TIME_FORMAT),
    };
  }

  private convertUsuarioToUsuarioRawValue(
    usuario: IUsuario | (Partial<NewUsuario> & UsuarioFormDefaults),
  ): UsuarioFormRawValue | PartialWithRequiredKeyOf<NewUsuarioFormRawValue> {
    return {
      ...usuario,
      birthday: usuario.birthday ? usuario.birthday.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
