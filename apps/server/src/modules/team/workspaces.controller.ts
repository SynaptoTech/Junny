import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../user-auth/jwt-auth.guard';
import { AcceptWorkspaceInviteDto } from './dto/accept-workspace-invite.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InviteWorkspaceMemberDto } from './dto/invite-workspace-member.dto';
import { WorkspacesService, type WorkspaceRole } from './workspaces.service';

type AuthedReq = Request & { user?: { id: string } };

@ApiTags('workspaces')
@Controller('v1/workspaces')
export class WorkspacesController {
  constructor(private readonly workspaces: WorkspacesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lista workspaces do utilizador autenticado' })
  listMine(@Req() req: AuthedReq) {
    return this.workspaces.listForUser(req.user!.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cria workspace e adiciona o criador como owner' })
  create(@Req() req: AuthedReq, @Body() dto: CreateWorkspaceDto) {
    return this.workspaces.create(req.user!.id, dto.name);
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lista membros do workspace' })
  listMembers(@Req() req: AuthedReq, @Param('id') id: string) {
    return this.workspaces.listMembers(id, req.user!.id);
  }

  @Post(':id/invites')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Cria convite (retorna token). MVP: apenas owner pode convidar.',
  })
  invite(
    @Req() req: AuthedReq,
    @Param('id') id: string,
    @Body() dto: InviteWorkspaceMemberDto,
  ) {
    return this.workspaces.inviteMember({
      workspaceId: id,
      invitedByUserId: req.user!.id,
      email: dto.email,
      role: (dto.role ?? 'viewer') as WorkspaceRole,
    });
  }

  @Post('invites/accept')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Aceita convite por token (email deve bater)' })
  accept(@Req() req: AuthedReq, @Body() dto: AcceptWorkspaceInviteDto) {
    return this.workspaces.acceptInvite(req.user!.id, dto.token);
  }
}

