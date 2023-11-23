import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICarro } from '../carro.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../carro.test-samples';

import { CarroService } from './carro.service';

const requireRestSample: ICarro = {
  ...sampleWithRequiredData,
};

describe('Carro Service', () => {
  let service: CarroService;
  let httpMock: HttpTestingController;
  let expectedResult: ICarro | ICarro[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CarroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Carro', () => {
      const carro = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(carro).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Carro', () => {
      const carro = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(carro).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Carro', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Carro', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Carro', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCarroToCollectionIfMissing', () => {
      it('should add a Carro to an empty array', () => {
        const carro: ICarro = sampleWithRequiredData;
        expectedResult = service.addCarroToCollectionIfMissing([], carro);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(carro);
      });

      it('should not add a Carro to an array that contains it', () => {
        const carro: ICarro = sampleWithRequiredData;
        const carroCollection: ICarro[] = [
          {
            ...carro,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCarroToCollectionIfMissing(carroCollection, carro);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Carro to an array that doesn't contain it", () => {
        const carro: ICarro = sampleWithRequiredData;
        const carroCollection: ICarro[] = [sampleWithPartialData];
        expectedResult = service.addCarroToCollectionIfMissing(carroCollection, carro);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(carro);
      });

      it('should add only unique Carro to an array', () => {
        const carroArray: ICarro[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const carroCollection: ICarro[] = [sampleWithRequiredData];
        expectedResult = service.addCarroToCollectionIfMissing(carroCollection, ...carroArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const carro: ICarro = sampleWithRequiredData;
        const carro2: ICarro = sampleWithPartialData;
        expectedResult = service.addCarroToCollectionIfMissing([], carro, carro2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(carro);
        expect(expectedResult).toContain(carro2);
      });

      it('should accept null and undefined values', () => {
        const carro: ICarro = sampleWithRequiredData;
        expectedResult = service.addCarroToCollectionIfMissing([], null, carro, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(carro);
      });

      it('should return initial array if no Carro is added', () => {
        const carroCollection: ICarro[] = [sampleWithRequiredData];
        expectedResult = service.addCarroToCollectionIfMissing(carroCollection, undefined, null);
        expect(expectedResult).toEqual(carroCollection);
      });
    });

    describe('compareCarro', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCarro(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCarro(entity1, entity2);
        const compareResult2 = service.compareCarro(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCarro(entity1, entity2);
        const compareResult2 = service.compareCarro(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCarro(entity1, entity2);
        const compareResult2 = service.compareCarro(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
