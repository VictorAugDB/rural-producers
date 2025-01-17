import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../../database/repositories/prisma.service';
import { AppModule } from '../../app.module';
import { DatabaseModule } from '../../database/database.module';
import { AdminFactory } from '../../../test/factories/admin-factory';
import { faker } from '@faker-js/faker/.';
import { ProducerFactory } from '../../../test/factories/producer-factory';

describe('properties (E2E)', () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let producerFactory: ProducerFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, ProducerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    adminFactory = moduleRef.get(AdminFactory);
    producerFactory = moduleRef.get(ProducerFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test.only('[POST] /properties', async () => {
    const admin = await adminFactory.makePrismaAdmin();
    const producer = await producerFactory.makePrismaProducer();

    const accessToken = jwt.sign({ sub: admin.id.toString() });

    const totalArea = faker.number.float({
      min: 100,
      max: 1000,
    });
    const arableArea = faker.number.float({
      min: 10,
      max: totalArea / 2,
    });
    const vegetationArea = faker.number.float({
      min: 10,
      max: totalArea - arableArea,
    });

    const data = {
      name: faker.company.name(),
      city: faker.location.city(),
      state: faker.location.state(),
      totalArea,
      arableArea,
      vegetationArea,
      producerId: producer.id.toString(),
    };

    const response = await request(app.getHttpServer())
      .post(`/properties`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data);

    expect(response.statusCode).toBe(201);

    const answerOnDatabase = await prisma.property.findFirst({
      where: {
        name: data.name,
      },
    });

    expect(answerOnDatabase).toBeTruthy();
  });
});
