import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../config/prisma.service';
import { IdentityService } from '../identity/identity.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

const SALT_ROUNDS = 10;
const JWT_ISS = 'junny';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly identity: IdentityService,
  ) {}

  private secret(): string {
    return process.env.JWT_SECRET ?? 'dev-jwt-secret-change-in-production';
  }

  private signToken(userId: string): string {
    return jwt.sign({ sub: userId }, this.secret(), {
      expiresIn: '7d',
      issuer: JWT_ISS,
    });
  }

  private toPublicUser(u: {
    id: string;
    email: string;
    name: string | null;
  }): AuthUser {
    return { id: u.id, email: u.email, name: u.name };
  }

  async register(dto: RegisterDto): Promise<{ accessToken: string; user: AuthUser }> {
    const email = dto.email.toLowerCase();

    if (this.identity.isEnabled()) {
      await this.identity.register({
        email,
        password: dto.password,
        name: dto.name?.trim() || undefined,
      });
      return this.syncLocalUserAfterIdentityRegister(email, dto.password, dto.name?.trim() || null);
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('This email is already registered.');
    }
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name: dto.name?.trim() || null,
      },
    });
    return {
      accessToken: this.signToken(user.id),
      user: this.toPublicUser(user),
    };
  }

  /** Espelha utilizador no SQLite do Junny (workspaces) após cadastro no Identity (perfil JUNNY_USER). */
  private async syncLocalUserAfterIdentityRegister(
    email: string,
    password: string,
    name: string | null,
  ): Promise<{ accessToken: string; user: AuthUser }> {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.prisma.user.upsert({
      where: { email },
      create: { email, passwordHash, name },
      update: { name: name ?? undefined, passwordHash },
    });
    return {
      accessToken: this.signToken(user.id),
      user: this.toPublicUser(user),
    };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: AuthUser }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    return {
      accessToken: this.signToken(user.id),
      user: this.toPublicUser(user),
    };
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true },
    });
    return user;
  }

  verifyAccessToken(token: string): { sub: string } {
    try {
      const decoded = jwt.verify(token, this.secret(), {
        issuer: JWT_ISS,
      }) as jwt.JwtPayload & { sub: string };
      if (typeof decoded.sub !== 'string' || !decoded.sub) {
        throw new UnauthorizedException();
      }
      return { sub: decoded.sub };
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
