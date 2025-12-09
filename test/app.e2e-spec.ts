import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Room Reservation System (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let roomId: string;
  let bookingId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication (e2e)', () => {
    it('should register a new guest user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'guest@test.com',
          password: 'password123',
          confirmPassword: 'password123',
          fullName: 'Test Guest',
          role: 'GUEST',
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.user.role).toBe('GUEST');
        });
    });

    it('should register a new owner user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'owner@test.com',
          password: 'password123',
          confirmPassword: 'password123',
          fullName: 'Test Owner',
          role: 'OWNER',
        })
        .expect(201)
        .expect(res => {
          authToken = res.body.access_token;
          expect(res.body.user.role).toBe('OWNER');
        });
    });

    it('should login user and return token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'owner@test.com',
          password: 'password123',
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('access_token');
          authToken = res.body.access_token;
        });
    });

    it('should fail login with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'owner@test.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Rooms (e2e)', () => {
    it('should create a room as owner', () => {
      return request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Luxury Suite',
          description: 'Beautiful room with ocean view',
          price: 150,
          capacity: 4,
        })
        .expect(201)
        .expect(res => {
          roomId = res.body.id;
          expect(res.body.title).toBe('Luxury Suite');
          expect(res.body.price).toBe(150);
        });
    });

    it('should get all available rooms', () => {
      return request(app.getHttpServer())
        .get('/rooms')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should get room by id', () => {
      return request(app.getHttpServer())
        .get(`/rooms/${roomId}`)
        .expect(200)
        .expect(res => {
          expect(res.body.id).toBe(roomId);
        });
    });

    it('should update room as owner', () => {
      return request(app.getHttpServer())
        .put(`/rooms/${roomId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Suite',
          price: 200,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.title).toBe('Updated Suite');
          expect(res.body.price).toBe(200);
        });
    });

    it('should filter rooms by price', () => {
      return request(app.getHttpServer())
        .get('/rooms?minPrice=100&maxPrice=250')
        .expect(200);
    });
  });

  describe('Bookings (e2e)', () => {
    it('should create a booking as guest', () => {
      return request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          roomId,
          checkInDate: '2025-12-20T10:00:00Z',
          checkOutDate: '2025-12-25T10:00:00Z',
        })
        .expect(201)
        .expect(res => {
          bookingId = res.body.id;
          expect(res.body.status).toBe('PENDING');
        });
    });

    it('should prevent overlapping bookings', () => {
      return request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          roomId,
          checkInDate: '2025-12-22T10:00:00Z',
          checkOutDate: '2025-12-27T10:00:00Z',
        })
        .expect(409);
    });

    it('should get guest bookings', () => {
      return request(app.getHttpServer())
        .get('/bookings/my-bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should cancel booking', () => {
      return request(app.getHttpServer())
        .put(`/bookings/${bookingId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body.status).toBe('CANCELLED');
        });
    });
  });

  describe('User Profile (e2e)', () => {
    it('should get user profile', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body.email).toBe('owner@test.com');
        });
    });

    it('should update user profile', () => {
      return request(app.getHttpServer())
        .put('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fullName: 'Updated Owner',
          phone: '1234567890',
        })
        .expect(200);
    });
  });
});
