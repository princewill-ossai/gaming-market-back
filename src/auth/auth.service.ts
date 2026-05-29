import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private admin = {
    email: 'admin@store.com',
    passwordHash: bcrypt.hashSync('12345678', 10),
  };

  async login(email: string, password: string) {
    // 1. CHECK EMAIL FIRST
    if (email !== this.admin.email) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. CHECK PASSWORD PROPERLY
    const isPasswordValid = await bcrypt.compare(
      password,
      this.admin.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. ONLY HERE — GENERATE TOKEN
    const token = this.jwtService.sign({
      email: this.admin.email,
      role: 'admin',
    });

    return {
      access_token: token,
    };
  }
}