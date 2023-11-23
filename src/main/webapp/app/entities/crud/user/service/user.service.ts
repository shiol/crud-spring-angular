import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUser, NewUser } from '../user.model';

export type PartialUpdateUser = Partial<IUser> & Pick<IUser, 'id'>;

type RestOf<T extends IUser | NewUser> = Omit<T, 'birthday'> & {
  birthday?: string | null;
};

export type RestUser = RestOf<IUser>;

export type NewRestUser = RestOf<NewUser>;

export type PartialUpdateRestUser = RestOf<PartialUpdateUser>;

export type EntityResponseType = HttpResponse<IUser>;
export type EntityArrayResponseType = HttpResponse<IUser[]>;

@Injectable({ providedIn: 'root' })
export class UserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/users', 'crud');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(user: NewUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(user);
    return this.http.post<RestUser>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(user: IUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(user);
    return this.http
      .put<RestUser>(`${this.resourceUrl}/${this.getUserIdentifier(user)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(user: PartialUpdateUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(user);
    return this.http
      .patch<RestUser>(`${this.resourceUrl}/${this.getUserIdentifier(user)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestUser>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUser[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserIdentifier(user: Pick<IUser, 'id'>): number {
    return user.id;
  }

  compareUser(o1: Pick<IUser, 'id'> | null, o2: Pick<IUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserIdentifier(o1) === this.getUserIdentifier(o2) : o1 === o2;
  }

  addUserToCollectionIfMissing<Type extends Pick<IUser, 'id'>>(
    userCollection: Type[],
    ...usersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const users: Type[] = usersToCheck.filter(isPresent);
    if (users.length > 0) {
      const userCollectionIdentifiers = userCollection.map(userItem => this.getUserIdentifier(userItem)!);
      const usersToAdd = users.filter(userItem => {
        const userIdentifier = this.getUserIdentifier(userItem);
        if (userCollectionIdentifiers.includes(userIdentifier)) {
          return false;
        }
        userCollectionIdentifiers.push(userIdentifier);
        return true;
      });
      return [...usersToAdd, ...userCollection];
    }
    return userCollection;
  }

  protected convertDateFromClient<T extends IUser | NewUser | PartialUpdateUser>(user: T): RestOf<T> {
    return {
      ...user,
      birthday: user.birthday?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restUser: RestUser): IUser {
    return {
      ...restUser,
      birthday: restUser.birthday ? dayjs(restUser.birthday) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestUser>): HttpResponse<IUser> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestUser[]>): HttpResponse<IUser[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
