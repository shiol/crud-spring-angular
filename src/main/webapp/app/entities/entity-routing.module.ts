import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'usuario',
        data: { pageTitle: 'crudApp.usuario.home.title' },
        loadChildren: () => import('./usuario/usuario.routes'),
      },
      {
        path: 'carro',
        data: { pageTitle: 'crudApp.carro.home.title' },
        loadChildren: () => import('./carro/carro.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
