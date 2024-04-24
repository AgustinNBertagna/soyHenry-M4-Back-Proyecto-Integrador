import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Validation } from '../src/pipes/validation.pipe';
import { MockAppModule } from './mocks/mockAppModule';
import { uuidRegex } from './mocks/mocks';

describe('Categories End-To-End.', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MockAppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(Validation);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET METHOD TO: localhost:3000/categories/seeder', () => {
    it('Should respond with a 201 status code and the message: "Categories and products reseeded.".', async () => {
      const response = await request(app.getHttpServer()).get(
        '/categories/seeder',
      );
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Categories and products reseeded.');
    });
  });

  describe('GET METHOD TO: localhost:3000/categories', () => {
    it('Should respond with a 200 status code and an array of categories.', async () => {
      const response = await request(app.getHttpServer()).get('/categories');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(4);
      const categoriesNames = ['smartphone', 'monitor', 'keyboard', 'mouse'];
      response.body.map((category: { id: string; name: string }) => {
        expect(category.id).toMatch(uuidRegex);
        expect(categoriesNames.includes(category.name)).toBe(true);
      });
    });
  });
});
