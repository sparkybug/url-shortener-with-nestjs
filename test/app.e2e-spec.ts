import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('URL Shortener (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  })

  afterAll(async () => {
    await app.close();
  })

  it('POST /shorten - valid URL returns 201 with shortCode', () => {
    return request(app.getHttpServer())
      .post('/shorten')
      .send({ url: 'https://thisisosinachilearningnestjs.com' })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('shortCode');
      });
  });

  it('POST /shorten - invalid URL returns 400', () => {
    return request(app.getHttpServer())
      .post('/shorten')
      .send({ url: 'not-a-url'})
      .expect(400);
  });
});
