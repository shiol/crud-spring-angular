import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'car',
        data: { pageTitle: 'crudApp.crudCar.home.title' },
        loadChildren: () => import('./crud/car/car.routes'),
      },
      {
        path: 'user',
        data: { pageTitle: 'crudApp.crudUser.home.title' },
        loadChildren: () => import('./crud/user/user.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
