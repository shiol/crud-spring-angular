import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICarro, NewCarro } from '../carro.model';

export type PartialUpdateCarro = Partial<ICarro> & Pick<ICarro, 'id'>;

export type EntityResponseType = HttpResponse<ICarro>;
export type EntityArrayResponseType = HttpResponse<ICarro[]>;

@Injectable({ providedIn: 'root' })
export class CarroService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/carros');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(carro: NewCarro): Observable<EntityResponseType> {
    return this.http.post<ICarro>(this.resourceUrl, carro, { observe: 'response' });
  }

  update(carro: ICarro): Observable<EntityResponseType> {
    return this.http.put<ICarro>(`${this.resourceUrl}/${this.getCarroIdentifier(carro)}`, carro, { observe: 'response' });
  }

  partialUpdate(carro: PartialUpdateCarro): Observable<EntityResponseType> {
    return this.http.patch<ICarro>(`${this.resourceUrl}/${this.getCarroIdentifier(carro)}`, carro, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICarro>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICarro[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCarroIdentifier(carro: Pick<ICarro, 'id'>): number {
    return carro.id;
  }

  compareCarro(o1: Pick<ICarro, 'id'> | null, o2: Pick<ICarro, 'id'> | null): boolean {
    return o1 && o2 ? this.getCarroIdentifier(o1) === this.getCarroIdentifier(o2) : o1 === o2;
  }

  addCarroToCollectionIfMissing<Type extends Pick<ICarro, 'id'>>(
    carroCollection: Type[],
    ...carrosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const carros: Type[] = carrosToCheck.filter(isPresent);
    if (carros.length > 0) {
      const carroCollectionIdentifiers = carroCollection.map(carroItem => this.getCarroIdentifier(carroItem)!);
      const carrosToAdd = carros.filter(carroItem => {
        const carroIdentifier = this.getCarroIdentifier(carroItem);
        if (carroCollectionIdentifiers.includes(carroIdentifier)) {
          return false;
        }
        carroCollectionIdentifiers.push(carroIdentifier);
        return true;
      });
      return [...carrosToAdd, ...carroCollection];
    }
    return carroCollection;
  }
}
