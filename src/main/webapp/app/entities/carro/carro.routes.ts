import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CarroComponent } from './list/carro.component';
import { CarroDetailComponent } from './detail/carro-detail.component';
import { CarroUpdateComponent } from './update/carro-update.component';
import CarroResolve from './route/carro-routing-resolve.service';

const carroRoute: Routes = [
  {
    path: '',
    component: CarroComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CarroDetailComponent,
    resolve: {
      carro: CarroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CarroUpdateComponent,
    resolve: {
      carro: CarroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CarroUpdateComponent,
    resolve: {
      carro: CarroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default carroRoute;
