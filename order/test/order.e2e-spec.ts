import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';
import { BaseOrder, Order } from '../src/order/order.entity';
import { baseOrderStub } from '../src/order/stubs/order.stub';

describe('Order Controller (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  const dto: BaseOrder = baseOrderStub();
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    connection = app.get(Connection);
    await connection.getRepository(Order).insert({ ...dto });
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await connection.createQueryBuilder().delete().from(Order).execute();
    await connection.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1'); // reset auto increment id
  });

  afterAll(async () => {
    await app.close();
  });

  describe('get order', () => {
    it('/order/1 (GET)', async () => {
      const res = await request(httpServer)
        .get('/order/1')
        .set({ Authorization: 'Bearer itisatoken' });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(dto);
    });
  });
});
