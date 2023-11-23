import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICarro, NewCarro } from '../carro.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICarro for edit and NewCarroFormGroupInput for create.
 */
type CarroFormGroupInput = ICarro | PartialWithRequiredKeyOf<NewCarro>;

type CarroFormDefaults = Pick<NewCarro, 'id'>;

type CarroFormGroupContent = {
  id: FormControl<ICarro['id'] | NewCarro['id']>;
  year: FormControl<ICarro['year']>;
  licensePlate: FormControl<ICarro['licensePlate']>;
  model: FormControl<ICarro['model']>;
  color: FormControl<ICarro['color']>;
  usuario: FormControl<ICarro['usuario']>;
};

export type CarroFormGroup = FormGroup<CarroFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CarroFormService {
  createCarroFormGroup(carro: CarroFormGroupInput = { id: null }): CarroFormGroup {
    const carroRawValue = {
      ...this.getFormDefaults(),
      ...carro,
    };
    return new FormGroup<CarroFormGroupContent>({
      id: new FormControl(
        { value: carroRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      year: new FormControl(carroRawValue.year),
      licensePlate: new FormControl(carroRawValue.licensePlate),
      model: new FormControl(carroRawValue.model),
      color: new FormControl(carroRawValue.color),
      usuario: new FormControl(carroRawValue.usuario),
    });
  }

  getCarro(form: CarroFormGroup): ICarro | NewCarro {
    return form.getRawValue() as ICarro | NewCarro;
  }

  resetForm(form: CarroFormGroup, carro: CarroFormGroupInput): void {
    const carroRawValue = { ...this.getFormDefaults(), ...carro };
    form.reset(
      {
        ...carroRawValue,
        id: { value: carroRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CarroFormDefaults {
    return {
      id: null,
    };
  }
}
