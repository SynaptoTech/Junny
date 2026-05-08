import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, type WorkspaceInvite } from '@prisma/client';
import { PrismaService } from '../../config/prisma.service';

export type WorkspaceRole = 'owner' | 'editor' | 'viewer';

const ROLE_ORDER: Record<WorkspaceRole, number> = {
  viewer: 1,
  editor: 2,
  owner: 3,
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function randomToken(): string {
  // URL-safe token
  return `${crypto.randomUUID().replace(/-/g, '')}${crypto
    .randomUUID()
    .replace(/-/g, '')}`;
}

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string) {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },
      orderBy: { createdAt: 'desc' },
    });
    return memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      role: m.role,
      createdAt: m.workspace.createdAt,
      updatedAt: m.workspace.updatedAt,
    }));
  }

  async create(userId: string, name: string) {
    const trimmed = name.trim().slice(0, 80);
    const workspace = await this.prisma.workspace.create({
      data: {
        name: trimmed || 'Workspace',
        members: {
          create: {
            userId,
            role: 'owner',
          },
        },
      },
    });
    return workspace;
  }

  async listMembers(workspaceId: string, userId: string) {
    await this.requireMember(workspaceId, userId, 'viewer');
    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return members.map((m) => ({
      id: m.id,
      role: m.role,
      createdAt: m.createdAt,
      user: m.user,
    }));
  }

  async inviteMember(params: {
    workspaceId: string;
    invitedByUserId: string;
    email: string;
    role: WorkspaceRole;
  }) {
    await this.requireMember(params.workspaceId, params.invitedByUserId, 'owner');

    const email = normalizeEmail(params.email);
    const role = params.role ?? 'viewer';

    // If the user already exists and is already a member, short-circuit.
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existingUser) {
      const membership = await this.prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: params.workspaceId,
            userId: existingUser.id,
          },
        },
      });
      if (membership) {
        return { alreadyMember: true as const };
      }
    }

    const token = randomToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7d

    const created = await this.prisma.workspaceInvite.create({
      data: {
        workspaceId: params.workspaceId,
        email,
        role,
        token,
        expiresAt,
        invitedByUserId: params.invitedByUserId,
      },
    });

    return {
      alreadyMember: false as const,
      invite: this.publicInvite(created),
    };
  }

  async acceptInvite(userId: string, token: string) {
    const invite = await this.prisma.workspaceInvite.findUnique({
      where: { token },
    });
    if (!invite) throw new NotFoundException('Invite not found.');
    if (invite.acceptedAt) throw new ForbiddenException('Invite already accepted.');
    if (invite.expiresAt.getTime() < Date.now()) {
      throw new ForbiddenException('Invite expired.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) throw new NotFoundException('User not found.');

    if (normalizeEmail(user.email) !== normalizeEmail(invite.email)) {
      throw new ForbiddenException('Invite email mismatch.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.workspaceMember.upsert({
        where: {
          workspaceId_userId: { workspaceId: invite.workspaceId, userId },
        },
        create: {
          workspaceId: invite.workspaceId,
          userId,
          role: (invite.role as WorkspaceRole) ?? 'viewer',
        },
        update: {},
      });
      await tx.workspaceInvite.update({
        where: { id: invite.id },
        data: { acceptedAt: new Date() },
      });
    });

    return { ok: true };
  }

  private publicInvite(i: WorkspaceInvite) {
    return {
      id: i.id,
      workspaceId: i.workspaceId,
      email: i.email,
      role: i.role,
      token: i.token,
      expiresAt: i.expiresAt,
      createdAt: i.createdAt,
    };
  }

  private async requireMember(
    workspaceId: string,
    userId: string,
    minRole: WorkspaceRole,
  ): Promise<{ role: WorkspaceRole }> {
    const m = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!m) throw new ForbiddenException('Not a workspace member.');
    const role = (m.role as WorkspaceRole) ?? 'viewer';
    if (ROLE_ORDER[role] < ROLE_ORDER[minRole]) {
      throw new ForbiddenException('Insufficient workspace role.');
    }
    return { role };
  }
}

