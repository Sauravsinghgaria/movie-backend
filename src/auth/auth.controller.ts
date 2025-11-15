import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('login')
  async login() {
    return { message: 'Login endpoint' };
  }

  @Post('logout')
  async logout() {
    return { message: 'Logout endpoint' };
  }
}
