import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICarro } from '../carro.model';
import { CarroService } from '../service/carro.service';

export const carroResolve = (route: ActivatedRouteSnapshot): Observable<null | ICarro> => {
  const id = route.params['id'];
  if (id) {
    return inject(CarroService)
      .find(id)
      .pipe(
        mergeMap((carro: HttpResponse<ICarro>) => {
          if (carro.body) {
            return of(carro.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default carroResolve;
