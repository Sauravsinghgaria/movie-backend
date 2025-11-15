import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/users.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async login(
    email: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<{ message: string; token: string; user: Partial<User> }> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    let user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      // Create new user if not exists
      const hashedPassword = await bcrypt.hash(password, 10);
      user = this.userRepository.create({
        email,
        password: hashedPassword,
        rememberMe,
      });
      await this.userRepository.save(user);
    }

    // Update rememberMe flag
    if (user.rememberMe !== rememberMe) {
      user.rememberMe = rememberMe;
      await this.userRepository.save(user);
    }

    // Generate JWT token
    const token = this.generateToken(user, rememberMe);

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        rememberMe: user.rememberMe,
      },
    };
  }

  async logout(userId: number): Promise<{ message: string }> {
    // Update rememberMe to false on logout
    await this.userRepository.update(userId, { rememberMe: false });

    return {
      message: 'Logout successful',
    };
  }

  private generateToken(user: User, rememberMe: boolean): string {
    const expiresIn = rememberMe ? '30d' : '24h'; // Longer expiration if rememberMe is true
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      } as JwtPayload,
      process.env.JWT_SECRET || '',
      { expiresIn },
    );
    return token;
  }

  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key',
      ) as JwtPayload;
      return decoded;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
