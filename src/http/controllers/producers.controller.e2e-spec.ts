import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../../database/repositories/prisma.service';
import { AppModule } from '../../app.module';
import { DatabaseModule } from '../../database/database.module';
import { AdminFactory } from '../../../test/factories/admin-factory';
import { generateFakeCPF } from '../../../test/utils/fake-cpf';

describe('Producers (E2E)', () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    adminFactory = moduleRef.get(AdminFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test.only('[POST] /producers', async () => {
    const admin = await adminFactory.makePrismaAdmin();

    const accessToken = jwt.sign({ sub: admin.id.toString() });

    const cpf = generateFakeCPF();

    const response = await request(app.getHttpServer())
      .post(`/producers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        cpfCnpj: cpf,
        name: 'John doe',
      });

    expect(response.statusCode).toBe(201);

    const answerOnDatabase = await prisma.producer.findFirst({
      where: {
        cpfCnpj: cpf,
      },
    });

    expect(answerOnDatabase).toBeTruthy();
  });
});
