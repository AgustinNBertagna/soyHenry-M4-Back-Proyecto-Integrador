import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Validation } from '../src/pipes/validation.pipe';
import { MockAppModule } from './mocks/mockAppModule';
import { Repository } from 'typeorm';
import { User } from '../src/entities/User.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  users,
  userLogin,
  adminLogin,
  fakeUUID,
  createProduct,
  updateProduct,
  uuidRegex,
} from './mocks/mocks';

describe('Products End-To-End.', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MockAppModule],
    }).compile();
    const liveUsers = await users();
    usersRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(Validation);
    await app.init();
    await usersRepository.save(liveUsers);
    adminToken = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(adminLogin)
      .then((response) => response.body.token);
    userToken = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(userLogin)
      .then((response) => response.body.token);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET METHOD TO: localhost:3000/products/seeder', () => {
    it('Should respond with a 201 status code and the message: "Products reseeded.".', async () => {
      const response = await request(app.getHttpServer()).get(
        '/products/seeder',
      );
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Products reseeded.');
    });
  });

  describe('GET METHOD TO: localhost:3000/products', () => {
    it('Should respond with a 200 status code and an array of products.', async () => {
      const response = await request(app.getHttpServer()).get('/products');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(12);
    });
  });

  describe('GET METHOD TO: localhost:3000/products/id', () => {
    it('Should respond with a 200 status code and a product if the product ID is a valid UUID and the product exists.', async () => {
      const id = await request(app.getHttpServer())
        .get('/products')
        .then((response) => response.body[0]['id']);
      const response = await request(app.getHttpServer()).get(
        `/products/${id}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('price');
      expect(response.body).toHaveProperty('stock');
      expect(response.body).toHaveProperty('imgUrl');
      expect(response.body).toHaveProperty('category');
    });
    it('Should respond with a 400 status code and the message: "Validation failed (uuid is expected)" if the product ID is not a valid UUID.', async () => {
      const response = await request(app.getHttpServer()).get(
        '/products/not-a-uuid',
      );
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Validation failed (uuid is expected)',
      );
      expect(response.body.error).toBe('Bad Request');
    });
    it('Should respond with a 404 status code and the message: "Product not found." if the product was not found.', async () => {
      const response = await request(app.getHttpServer()).get(
        `/products/${fakeUUID}`,
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Product not found.');
      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('POST METHOD TO: localhost:3000/products', () => {
    it('Should respond with a 201 status code and the product ID if the product was successfully created.', async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send(createProduct)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(201);
      expect(response.body.id).toMatch(uuidRegex);
    });
    it('Should respond with a 404 status code and the message: "Category not found." if the category was not found.', async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send({ ...createProduct, category: 'Not a valid category' })
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Category not found.');
      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('PUT METHOD TO: localhost:3000/products/id', () => {
    it('Should respond with a 200 status code and the product ID if the product was successfully updated.', async () => {
      const productId = await request(app.getHttpServer())
        .get('/products')
        .then((response) => response.body[0]['id']);
      const response = await request(app.getHttpServer())
        .put(`/products/${productId}`)
        .send(updateProduct)
        .set({ authorization: `Bearer ${adminToken}` });
      expect(response.statusCode).toBe(201);
      expect(response.body.id).toMatch(uuidRegex);
    });
    it('Should respond with a 400 status code and the message: "Validation failed (uuid is expected)" if the product ID is not a valid UUID.', async () => {
      const response = await request(app.getHttpServer())
        .put('/products/not-a-uuid')
        .send(updateProduct)
        .set({ authorization: `Bearer ${adminToken}` });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Validation failed (uuid is expected)',
      );
      expect(response.body.error).toBe('Bad Request');
    });
    it('Should respond with a 404 status code and the message: "Product not found." if the product was not found.', async () => {
      const response = await request(app.getHttpServer())
        .put(`/products/${fakeUUID}`)
        .send(updateProduct)
        .set({ authorization: `Bearer ${adminToken}` });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Product not found.');
      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('DELETE METHOD TO: localhost:3000/products/id', () => {
    it('Should respond with a 200 status code and the product ID if the product was successfully deleted.', async () => {
      const productId = await request(app.getHttpServer())
        .get('/products')
        .then((response) => response.body[0]['id']);
      const response = await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toMatch(uuidRegex);
    });
    it('Should respond with a 400 status code and the message: "Validation failed (uuid is expected)" if the product ID is not a valid UUID.', async () => {
      const response = await request(app.getHttpServer())
        .delete('/products/not-a-uuid')
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Validation failed (uuid is expected)',
      );
      expect(response.body.error).toBe('Bad Request');
    });
    it('Should respond with a 404 status code and the message: "Product not found." if the product was not found.', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/products/${fakeUUID}`)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Product not found.');
      expect(response.body.error).toBe('Not Found');
    });
  });
});
