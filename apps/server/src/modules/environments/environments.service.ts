import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../config/prisma.service';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';

export interface EnvironmentResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  variables: Record<string, string>;
}

@Injectable()
export class EnvironmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<EnvironmentResponse[]> {
    const rows = await this.prisma.environment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { variables: true },
    });
    return rows.map((e) => this.formatEnvironment(e));
  }

  async findOne(id: string): Promise<EnvironmentResponse> {
    const row = await this.prisma.environment.findUnique({
      where: { id },
      include: { variables: true },
    });
    if (!row) throw new NotFoundException(`Environment ${id}`);
    return this.formatEnvironment(row);
  }

  async create(dto: CreateEnvironmentDto): Promise<EnvironmentResponse> {
    const vars = dto.variables ?? {};
    const env = await this.prisma.environment.create({
      data: {
        name: dto.name,
        variables: {
          create: Object.entries(vars).map(([key, value]) => ({
            key,
            value,
          })),
        },
      },
      include: { variables: true },
    });
    return this.formatEnvironment(env);
  }

  async update(
    id: string,
    dto: UpdateEnvironmentDto,
  ): Promise<EnvironmentResponse> {
    await this.findOne(id);
    await this.prisma.$transaction(async (tx) => {
      if (dto.name !== undefined) {
        await tx.environment.update({
          where: { id },
          data: { name: dto.name },
        });
      }
      if (dto.variables !== undefined) {
        await tx.environmentVariable.deleteMany({ where: { environmentId: id } });
        const entries = Object.entries(dto.variables);
        if (entries.length > 0) {
          await tx.environmentVariable.createMany({
            data: entries.map(([key, value]) => ({
              environmentId: id,
              key,
              value,
            })),
          });
        }
      }
    });
    const row = await this.prisma.environment.findUniqueOrThrow({
      where: { id },
      include: { variables: true },
    });
    return this.formatEnvironment(row);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.environment.delete({ where: { id } });
  }

  private formatEnvironment(
    env: Prisma.EnvironmentGetPayload<{ include: { variables: true } }>,
  ): EnvironmentResponse {
    return {
      id: env.id,
      name: env.name,
      createdAt: env.createdAt,
      updatedAt: env.updatedAt,
      variables: Object.fromEntries(
        env.variables.map((v) => [v.key, v.value]),
      ),
    };
  }
}
