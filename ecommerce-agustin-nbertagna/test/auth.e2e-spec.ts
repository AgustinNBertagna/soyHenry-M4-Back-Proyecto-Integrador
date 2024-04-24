import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Validation } from '../src/pipes/validation.pipe';
import { MockAppModule } from './mocks/mockAppModule';

describe('Auth End-To-End.', () => {
  let app: INestApplication;

  const user = {
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    password: '!MySecret@1',
    confirmPassword: '!MySecret@1',
    address: '321 Secondary Avenue',
    phone: 1112345,
    country: 'United States',
    city: 'California',
  };

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

  describe('POST METHOD TO: localhost:3000/auth/signup', () => {
    it('Should respond with a 201 status code and the partial user data with the id if the user signed up succesfully.', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user);
      expect(response.statusCode).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('phone');
      expect(response.body).toHaveProperty('country');
      expect(response.body).toHaveProperty('city');
    });
    it('Should respond with a 400 status code and an array of errors if the sent body was not valid.', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ isAdmin: true, city: 1, country: 2 });
      expect(response.statusCode).toBe(400);
      expect(response.body.alert).toBe('Request Error');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors).toHaveLength(9);
    });
    it('Should respond with a 400 status code and the message: "Email already in use." if the email is already in use.', async () => {
      await request(app.getHttpServer()).post('/auth/signup').send(user);
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Email already in use.');
      expect(response.body.error).toBe('Bad Request');
    });
    it('Should respond with a 400 status code and the message: "Confirm password must be equal to passowrd." if the passwords are not equal.', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ ...user, confirmPassword: '!1NOTsame' });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Confirm password must be equal to passowrd.',
      );
      expect(response.body.error).toBe('Bad Request');
    });
  });

  describe('POST METHOD TO: localhost:3000/auth/signin', () => {
    it('Should respond with a 201 status code, a message: "User logged in successfully." and a token if the user logged in successfully.', async () => {
      await request(app.getHttpServer()).post('/auth/signup').send(user);
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: user.email, password: user.password });
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('User logged in successfully.');
      expect(response.body.token).toBeDefined();
    });
    it('Should respond with a 400 status code and an array of errors if the body was not sent.', async () => {
      const response = await request(app.getHttpServer()).post('/auth/signin');
      expect(response.statusCode).toBe(400);
      expect(response.body.alert).toBe('Request Error');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors).toHaveLength(2);
    });
    it('Should respond with a 400 status code and the message: "User not found." if the user was not found.', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: user.email, password: user.password });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User not found.');
      expect(response.body.error).toBe('Not Found');
    });
    it('Should respond with a 400 status code and the message: "Invalid credentials." if the password is not valid.', async () => {
      await request(app.getHttpServer()).post('/auth/signup').send(user);
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: user.email, password: '!1NOTsame' });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Invalid credentials.');
      expect(response.body.error).toBe('Bad Request');
    });
  });
});
