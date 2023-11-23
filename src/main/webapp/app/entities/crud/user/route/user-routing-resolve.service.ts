import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUser } from '../user.model';
import { UserService } from '../service/user.service';

export const userResolve = (route: ActivatedRouteSnapshot): Observable<null | IUser> => {
  const id = route.params['id'];
  if (id) {
    return inject(UserService)
      .find(id)
      .pipe(
        mergeMap((user: HttpResponse<IUser>) => {
          if (user.body) {
            return of(user.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default userResolve;
