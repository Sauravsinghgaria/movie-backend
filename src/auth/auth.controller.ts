import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
      rememberMe?: boolean;
    },
  ) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }

    return await this.authService.login(
      body.email,
      body.password,
      body.rememberMe || false,
    );
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new BadRequestException('Authorization header is required');
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      const decoded = this.authService.verifyToken(token);

      return await this.authService.logout(decoded.id);
    } catch {
      throw new BadRequestException('Invalid token');
    }
  }
}
