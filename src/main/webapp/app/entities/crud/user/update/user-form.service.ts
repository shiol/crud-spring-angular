import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUser, NewUser } from '../user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUser for edit and NewUserFormGroupInput for create.
 */
type UserFormGroupInput = IUser | PartialWithRequiredKeyOf<NewUser>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUser | NewUser> = Omit<T, 'birthday'> & {
  birthday?: string | null;
};

type UserFormRawValue = FormValueOf<IUser>;

type NewUserFormRawValue = FormValueOf<NewUser>;

type UserFormDefaults = Pick<NewUser, 'id' | 'birthday'>;

type UserFormGroupContent = {
  id: FormControl<UserFormRawValue['id'] | NewUser['id']>;
  firstName: FormControl<UserFormRawValue['firstName']>;
  lastName: FormControl<UserFormRawValue['lastName']>;
  email: FormControl<UserFormRawValue['email']>;
  birthday: FormControl<UserFormRawValue['birthday']>;
  login: FormControl<UserFormRawValue['login']>;
  password: FormControl<UserFormRawValue['password']>;
  phone: FormControl<UserFormRawValue['phone']>;
};

export type UserFormGroup = FormGroup<UserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserFormService {
  createUserFormGroup(user: UserFormGroupInput = { id: null }): UserFormGroup {
    const userRawValue = this.convertUserToUserRawValue({
      ...this.getFormDefaults(),
      ...user,
    });
    return new FormGroup<UserFormGroupContent>({
      id: new FormControl(
        { value: userRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      firstName: new FormControl(userRawValue.firstName),
      lastName: new FormControl(userRawValue.lastName),
      email: new FormControl(userRawValue.email),
      birthday: new FormControl(userRawValue.birthday),
      login: new FormControl(userRawValue.login),
      password: new FormControl(userRawValue.password),
      phone: new FormControl(userRawValue.phone),
    });
  }

  getUser(form: UserFormGroup): IUser | NewUser {
    return this.convertUserRawValueToUser(form.getRawValue() as UserFormRawValue | NewUserFormRawValue);
  }

  resetForm(form: UserFormGroup, user: UserFormGroupInput): void {
    const userRawValue = this.convertUserToUserRawValue({ ...this.getFormDefaults(), ...user });
    form.reset(
      {
        ...userRawValue,
        id: { value: userRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UserFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      birthday: currentTime,
    };
  }

  private convertUserRawValueToUser(rawUser: UserFormRawValue | NewUserFormRawValue): IUser | NewUser {
    return {
      ...rawUser,
      birthday: dayjs(rawUser.birthday, DATE_TIME_FORMAT),
    };
  }

  private convertUserToUserRawValue(
    user: IUser | (Partial<NewUser> & UserFormDefaults),
  ): UserFormRawValue | PartialWithRequiredKeyOf<NewUserFormRawValue> {
    return {
      ...user,
      birthday: user.birthday ? user.birthday.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
