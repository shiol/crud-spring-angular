import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UsuarioDetailComponent } from './usuario-detail.component';

describe('Usuario Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: UsuarioDetailComponent,
              resolve: { usuario: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(UsuarioDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load usuario on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UsuarioDetailComponent);

      // THEN
      expect(instance.usuario).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
