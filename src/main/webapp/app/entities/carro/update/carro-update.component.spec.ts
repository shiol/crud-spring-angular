import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { CarroService } from '../service/carro.service';
import { ICarro } from '../carro.model';
import { CarroFormService } from './carro-form.service';

import { CarroUpdateComponent } from './carro-update.component';

describe('Carro Management Update Component', () => {
  let comp: CarroUpdateComponent;
  let fixture: ComponentFixture<CarroUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let carroFormService: CarroFormService;
  let carroService: CarroService;
  let usuarioService: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CarroUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CarroUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CarroUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    carroFormService = TestBed.inject(CarroFormService);
    carroService = TestBed.inject(CarroService);
    usuarioService = TestBed.inject(UsuarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Usuario query and add missing value', () => {
      const carro: ICarro = { id: 456 };
      const usuario: IUsuario = { id: 17396 };
      carro.usuario = usuario;

      const usuarioCollection: IUsuario[] = [{ id: 24733 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: usuarioCollection })));
      const additionalUsuarios = [usuario];
      const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ carro });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(
        usuarioCollection,
        ...additionalUsuarios.map(expect.objectContaining),
      );
      expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const carro: ICarro = { id: 456 };
      const usuario: IUsuario = { id: 17319 };
      carro.usuario = usuario;

      activatedRoute.data = of({ carro });
      comp.ngOnInit();

      expect(comp.usuariosSharedCollection).toContain(usuario);
      expect(comp.carro).toEqual(carro);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICarro>>();
      const carro = { id: 123 };
      jest.spyOn(carroFormService, 'getCarro').mockReturnValue(carro);
      jest.spyOn(carroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ carro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: carro }));
      saveSubject.complete();

      // THEN
      expect(carroFormService.getCarro).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(carroService.update).toHaveBeenCalledWith(expect.objectContaining(carro));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICarro>>();
      const carro = { id: 123 };
      jest.spyOn(carroFormService, 'getCarro').mockReturnValue({ id: null });
      jest.spyOn(carroService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ carro: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: carro }));
      saveSubject.complete();

      // THEN
      expect(carroFormService.getCarro).toHaveBeenCalled();
      expect(carroService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICarro>>();
      const carro = { id: 123 };
      jest.spyOn(carroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ carro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(carroService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUsuario', () => {
      it('Should forward to usuarioService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(usuarioService, 'compareUsuario');
        comp.compareUsuario(entity, entity2);
        expect(usuarioService.compareUsuario).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
