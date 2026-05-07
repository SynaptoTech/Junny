import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';

@Injectable()
export class EnvironmentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.environment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.environment.findUnique({ where: { id } });
    if (!row) throw new NotFoundException(`Environment ${id}`);
    return row;
  }

  create(dto: CreateEnvironmentDto) {
    return this.prisma.environment.create({
      data: {
        name: dto.name,
        variables: dto.variables,
      },
    });
  }

  async update(id: string, dto: UpdateEnvironmentDto) {
    await this.findOne(id);
    return this.prisma.environment.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.environment.delete({ where: { id } });
  }
}
