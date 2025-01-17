import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminsRepository } from '../../domain/repositories/admins-repository';
import { compare, hash } from 'bcrypt';
import { Admin } from '../../domain/entities/Admin';
import { JwtService } from '@nestjs/jwt';

type SignUpInput = {
  email: string;
  password: string;
  name: string;
};

type SignInInput = {
  email: string;
  password: string;
};

@Injectable()
export class AdminsService {
  constructor(
    private adminsRepository: AdminsRepository,
    private jwtService: JwtService,
  ) {}

  async signUp({ email, name, password }: SignUpInput) {
    const adminAlreadyExists = await this.adminsRepository.getByEmail(email);

    if (adminAlreadyExists) {
      throw new ConflictException(
        'There are already an account with this email.',
      );
    }

    const hashedPassword = await hash(password, 8);
    const admin = Admin.create({
      email,
      name,
      password: hashedPassword,
    });

    await this.adminsRepository.create(admin);

    const accessToken = await this.jwtService.signAsync({
      sub: admin.id.toString(),
    });

    return {
      accessToken,
    };
  }

  async signIn({ email, password }: SignInInput) {
    const admin = await this.adminsRepository.getByEmail(email);

    if (!admin) {
      throw new UnauthorizedException('Incorrect email or password!');
    }

    const isPasswordValid = await compare(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect email or password!');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: admin.id.toString(),
    });

    return {
      accessToken,
    };
  }
}
