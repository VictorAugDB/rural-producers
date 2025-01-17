import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { Public } from '../../auth/public-decorator';
import { createZodDto, ZodValidationPipe } from 'nestjs-zod';
import { AdminsService } from '../services/admins.service';
import { ApiBody } from '@nestjs/swagger';

const signUpSchema = z.object({
  name: z.string().max(80),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((value) => /[0-9]/.test(value), {
      message: 'Password must contain at least one number',
    })
    .refine((value) => /[^a-zA-Z0-9]/.test(value), {
      message: 'Password must contain at least one special character',
    }),
});

type SignUpSchema = z.infer<typeof signUpSchema>;
class SignUpDto extends createZodDto(signUpSchema) {}

const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((value) => /[0-9]/.test(value), {
      message: 'Password must contain at least one number',
    })
    .refine((value) => /[^a-zA-Z0-9]/.test(value), {
      message: 'Password must contain at least one special character',
    }),
});

type SignInSchema = z.infer<typeof signInSchema>;
class SignInDto extends createZodDto(signInSchema) {}

@Controller('')
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @Public()
  @Post('sign-up')
  @ApiBody({ type: SignUpDto })
  @UsePipes(new ZodValidationPipe(signUpSchema))
  async signUp(@Body() body: SignUpSchema) {
    const { email, name, password } = body;

    const { accessToken } = await this.adminsService.signUp({
      email,
      name,
      password,
    });

    return {
      accessToken,
    };
  }

  @Public()
  @Post('sign-in')
  @ApiBody({ type: SignInDto })
  async signIn(@Body() body: SignInSchema) {
    const { email, password } = body;

    const { accessToken } = await this.adminsService.signIn({
      email,
      password,
    });

    return {
      accessToken,
    };
  }
}
