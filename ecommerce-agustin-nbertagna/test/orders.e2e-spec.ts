import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Validation } from '../src/pipes/validation.pipe';
import { MockAppModule } from './mocks/mockAppModule';
import { Repository } from 'typeorm';
import { User } from '../src/entities/User.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { users, userLogin, fakeUUID, createProduct } from './mocks/mocks';

describe('Orders End-To-End.', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let userToken: string;
  let liveUsers;
  let products;
  let order;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MockAppModule],
    }).compile();
    liveUsers = await users();
    usersRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(Validation);
    await app.init();
    await usersRepository.save(liveUsers[1]);
    userToken = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(userLogin)
      .then((response) => response.body.token);
    products = await request(app.getHttpServer())
      .get('/products')
      .then((response) => response.body);
    order = {
      userId: liveUsers[1]['id'],
      products: [{ id: products[0]['id'] }, { id: products[1]['id'] }],
    };
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET METHOD TO: localhost:3000/orders/id', () => {
    it("Should respond with a 200 status code and an order with it's order details and products.", async () => {
      const id = await request(app.getHttpServer())
        .post('/orders')
        .send(order)
        .set({ authorization: `Bearer ${userToken}` })
        .then((response) => response.body.id);
      const response = await request(app.getHttpServer())
        .get(`/orders/${id}`)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('date');
      expect(response.body).toHaveProperty('orderDetails');
      expect(response.body.orderDetails).toBeInstanceOf(Object);
      expect(response.body.orderDetails).toHaveProperty('id');
      expect(response.body.orderDetails).toHaveProperty('price');
      expect(response.body.orderDetails).toHaveProperty('products');
      expect(response.body.orderDetails.products).toBeInstanceOf(Array);
      expect(response.body.orderDetails.products).toHaveLength(2);
    });
    it('Should respond with a 400 status code and the message: "Validation failed (uuid is expected)" if the order ID is not a valid UUID.', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders/not-a-uuid')
        .send(order)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Validation failed (uuid is expected)',
      );
      expect(response.body.error).toBe('Bad Request');
    });
    it('Should respond with a 404 status code and the message: "Order not found." if the order was not found.', async () => {
      const response = await request(app.getHttpServer())
        .get(`/orders/${fakeUUID}`)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Order not found.');
      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('POST METHOD TO: localhost:3000/orders', () => {
    it("Should respond with a 201 status code and an order with it's order details if the order was successfully created.", async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(order)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('date');
      expect(response.body).toHaveProperty('orderDetails');
      expect(response.body.orderDetails).toBeInstanceOf(Object);
      expect(response.body.orderDetails).toHaveProperty('id');
      expect(response.body.orderDetails).toHaveProperty('price');
    });
    it('Should respond with a 400 status code and an array of errors if the body was not sent.', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .send()
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(400);
      expect(response.body.alert).toBe('Request Error');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors).toHaveLength(2);
    });
    it('Should respond with a 404 status code and the message: "User not found." if the user was not found.', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .send({ ...order, userId: fakeUUID })
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User not found.');
      expect(response.body.error).toBe('Not Found');
    });
    it('Should respond with a 404 status code and the message: "Product not found." if at least one of the products was not found.', async () => {
      const response = await request(app.getHttpServer())
        .post('/orders')
        .send({
          ...order,
          products: [{ id: fakeUUID }, { id: products[1]['id'] }],
        })
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Product not found.');
      expect(response.body.error).toBe('Not Found');
    });
    it('Should respond with a 409 status code and the message: "Insufficient stock to place the order." if at least one of the products has no stock.', async () => {
      const id = await request(app.getHttpServer())
        .post('/products')
        .send({ ...createProduct, stock: 0 })
        .set({ authorization: `Bearer ${userToken}` })
        .then((response) => response.body.id);
      const response = await request(app.getHttpServer())
        .post('/orders')
        .send({ ...order, products: [{ id }, { id: products[1]['id'] }] })
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe(
        'Insufficient stock to place the order.',
      );
      expect(response.body.error).toBe('Conflict');
    });
  });
});
