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
  adminLogin,
  userLogin,
  createUser,
  updateUser,
  fakeUUID,
  uuidRegex,
} from './mocks/mocks';

describe('Users End-To-End.', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let adminToken: string;
  let userToken: string;
  let liveUsers;

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

  describe('GET METHOD TO: localhost:3000/users', () => {
    it('Should respond with a 200 status code and an array of users if at least one user exists.', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set({ authorization: `Bearer ${adminToken}` });
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET METHOD TO: localhost:3000/users/id', () => {
    it('Should respond with a 200 status code and a user if the ID belongs to a user.', async () => {
      const id = liveUsers[0]['id'];
      const response = await request(app.getHttpServer())
        .get(`/users/${id}`)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('phone');
      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('country');
      expect(response.body).toHaveProperty('city');
      expect(response.body).toHaveProperty('orders');
    });
    it('Should respond with a 400 status code and the message: "Validation failed (uuid is expected)" if the user ID is not a valid UUID.', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/not-a-uuid')
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Validation failed (uuid is expected)',
      );
      expect(response.body.error).toBe('Bad Request');
    });
    it('Should respond with a 404 status code and the message: "User not found." if the user was not found.', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${fakeUUID}`)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User not found.');
      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('POST METHOD TO: localhost:3000/users/', () => {
    it('Should respond with a 502 status code and the message: "Out of service." due to be an out of service endpoint.', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUser);
      expect(response.statusCode).toBe(502);
      expect(response.body.message).toBe('Out of service.');
      expect(response.body.error).toBe('Bad Gateway');
    });
  });

  describe('PUT METHOD TO: localhost:3000/users/id', () => {
    it('Should respond with a 200 status code and the user ID if the user was successfully updated.', async () => {
      const id = liveUsers[1]['id'];
      const response = await request(app.getHttpServer())
        .put(`/users/${id}`)
        .send(updateUser)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toMatch(uuidRegex);
    });
    it('Should respond with a 400 status code and the message: "Validation failed (uuid is expected)" if the user ID is not a valid UUID.', async () => {
      const response = await request(app.getHttpServer())
        .put('/users/not-a-uuid')
        .send(updateUser)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Validation failed (uuid is expected)',
      );
      expect(response.body.error).toBe('Bad Request');
    });
    it('Should respond with a 404 status code and the message: "User not found." if the user was not found.', async () => {
      const response = await request(app.getHttpServer())
        .put(`/users/${fakeUUID}`)
        .send(updateUser)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User not found.');
      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('DELETE METHOD TO: localhost:3000/users/id', () => {
    it('Should respond with a 200 status code and the user ID if the user was successfully deleted.', async () => {
      const id = liveUsers[1]['id'];
      const response = await request(app.getHttpServer())
        .delete(`/users/${id}`)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toMatch(uuidRegex);
    });
    it('Should respond with a 400 status code and the message: "Validation failed (uuid is expected)" if the user ID is not a valid UUID.', async () => {
      const response = await request(app.getHttpServer())
        .delete('/users/not-a-uuid')
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Validation failed (uuid is expected)',
      );
      expect(response.body.error).toBe('Bad Request');
    });
    it('Should respond with a 404 status code and the message: "User not found." if the user was not found.', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${fakeUUID}`)
        .set({ authorization: `Bearer ${userToken}` });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User not found.');
      expect(response.body.error).toBe('Not Found');
    });
  });
});
