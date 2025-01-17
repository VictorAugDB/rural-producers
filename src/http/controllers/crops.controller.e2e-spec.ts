import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../../database/repositories/prisma.service';
import { AppModule } from '../../app.module';
import { DatabaseModule } from '../../database/database.module';
import { AdminFactory } from '../../../test/factories/admin-factory';
import { PropertyFactory } from '../../../test/factories/property-factory';
import { faker } from '@faker-js/faker/.';
import { ProducerFactory } from '../../../test/factories/producer-factory';

describe('Crops (E2E)', () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let propertyFactory: PropertyFactory;
  let producerFactory: ProducerFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, PropertyFactory, ProducerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    adminFactory = moduleRef.get(AdminFactory);
    propertyFactory = moduleRef.get(PropertyFactory);
    producerFactory = moduleRef.get(ProducerFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /crops', async () => {
    const user = await adminFactory.makePrismaAdmin();
    const producer = await producerFactory.makePrismaProducer();
    const property = await propertyFactory.makePrismaProperty({
      producerId: producer.id,
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const data = {
      name: faker.lorem.word(),
      season: faker.date.past().getFullYear().toString(),
      propertyId: property.id.toString(),
    };

    const response = await request(app.getHttpServer())
      .post(`/crops`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data);

    expect(response.statusCode).toBe(201);

    const answerOnDatabase = await prisma.crop.findFirst({
      where: {
        name: data.name,
      },
    });

    expect(answerOnDatabase).toBeTruthy();
  });
});
