import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { ICarro } from '../carro.model';
import { CarroService } from '../service/carro.service';
import { CarroFormService, CarroFormGroup } from './carro-form.service';

@Component({
  standalone: true,
  selector: 'jhi-carro-update',
  templateUrl: './carro-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CarroUpdateComponent implements OnInit {
  isSaving = false;
  carro: ICarro | null = null;

  usuariosSharedCollection: IUsuario[] = [];

  editForm: CarroFormGroup = this.carroFormService.createCarroFormGroup();

  constructor(
    protected carroService: CarroService,
    protected carroFormService: CarroFormService,
    protected usuarioService: UsuarioService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ carro }) => {
      this.carro = carro;
      if (carro) {
        this.updateForm(carro);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const carro = this.carroFormService.getCarro(this.editForm);
    if (carro.id !== null) {
      this.subscribeToSaveResponse(this.carroService.update(carro));
    } else {
      this.subscribeToSaveResponse(this.carroService.create(carro));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICarro>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(carro: ICarro): void {
    this.carro = carro;
    this.carroFormService.resetForm(this.editForm, carro);

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      carro.usuario,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, this.carro?.usuario)))
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }
}
