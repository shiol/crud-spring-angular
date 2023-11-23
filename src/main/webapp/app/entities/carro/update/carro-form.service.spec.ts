import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../carro.test-samples';

import { CarroFormService } from './carro-form.service';

describe('Carro Form Service', () => {
  let service: CarroFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarroFormService);
  });

  describe('Service methods', () => {
    describe('createCarroFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCarroFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            year: expect.any(Object),
            licensePlate: expect.any(Object),
            model: expect.any(Object),
            color: expect.any(Object),
            usuario: expect.any(Object),
          }),
        );
      });

      it('passing ICarro should create a new form with FormGroup', () => {
        const formGroup = service.createCarroFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            year: expect.any(Object),
            licensePlate: expect.any(Object),
            model: expect.any(Object),
            color: expect.any(Object),
            usuario: expect.any(Object),
          }),
        );
      });
    });

    describe('getCarro', () => {
      it('should return NewCarro for default Carro initial value', () => {
        const formGroup = service.createCarroFormGroup(sampleWithNewData);

        const carro = service.getCarro(formGroup) as any;

        expect(carro).toMatchObject(sampleWithNewData);
      });

      it('should return NewCarro for empty Carro initial value', () => {
        const formGroup = service.createCarroFormGroup();

        const carro = service.getCarro(formGroup) as any;

        expect(carro).toMatchObject({});
      });

      it('should return ICarro', () => {
        const formGroup = service.createCarroFormGroup(sampleWithRequiredData);

        const carro = service.getCarro(formGroup) as any;

        expect(carro).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICarro should not enable id FormControl', () => {
        const formGroup = service.createCarroFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCarro should disable id FormControl', () => {
        const formGroup = service.createCarroFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
