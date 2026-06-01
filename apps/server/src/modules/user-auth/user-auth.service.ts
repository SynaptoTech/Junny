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
      const session = await this.identity.register({
        email,
        password: dto.password,
        name: dto.name?.trim() || undefined,
      });
      return this.syncLocalUserFromIdentity(
        session.user,
        dto.password,
        dto.name?.trim() || session.user.name,
      );
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
    await this.provisionDefaultWorkspace(user.id);
    return {
      accessToken: this.signToken(user.id),
      user: this.toPublicUser(user),
    };
  }

  /**
   * Credenciais no Identity; espelho local (SQLite) para workspaces + JWT da API Junny.
   */
  private async syncLocalUserFromIdentity(
    identityUser: { id: string; email: string; name: string | null },
    password: string,
    name: string | null,
  ): Promise<{ accessToken: string; user: AuthUser }> {
    const email = identityUser.email.toLowerCase();
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.prisma.user.upsert({
      where: { email },
      create: {
        email,
        passwordHash,
        name: name ?? identityUser.name,
      },
      update: {
        name: name ?? identityUser.name ?? undefined,
        passwordHash,
      },
    });
    await this.provisionDefaultWorkspace(user.id);
    return {
      accessToken: this.signToken(user.id),
      user: this.toPublicUser(user),
    };
  }

  /** Workspace + collection inicial para utilizadores novos (Identity ou registo local). */
  private async provisionDefaultWorkspace(userId: string): Promise<void> {
    const memberships = await this.prisma.workspaceMember.count({
      where: { userId },
    });
    if (memberships > 0) return;

    await this.prisma.workspace.create({
      data: {
        name: 'Personal',
        members: {
          create: { userId, role: 'owner' },
        },
        collections: {
          create: { name: 'My requests' },
        },
      },
    });
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: AuthUser }> {
    const email = dto.email.toLowerCase();

    if (this.identity.isEnabled()) {
      const session = await this.identity.login({
        email,
        password: dto.password,
      });
      return this.syncLocalUserFromIdentity(
        session.user,
        dto.password,
        session.user.name,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    await this.provisionDefaultWorkspace(user.id);
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
    if (!user) return null;
    await this.provisionDefaultWorkspace(user.id);
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
