import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CarroDetailComponent } from './carro-detail.component';

describe('Carro Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarroDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CarroDetailComponent,
              resolve: { carro: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CarroDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load carro on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CarroDetailComponent);

      // THEN
      expect(instance.carro).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
