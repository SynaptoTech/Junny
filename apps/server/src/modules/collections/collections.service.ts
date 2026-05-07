import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.collection.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.collection.findUnique({ where: { id } });
    if (!row) throw new NotFoundException(`Collection ${id}`);
    return row;
  }

  create(dto: CreateCollectionDto) {
    return this.prisma.collection.create({ data: dto });
  }

  async update(id: string, dto: UpdateCollectionDto) {
    await this.findOne(id);
    return this.prisma.collection.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.collection.delete({ where: { id } });
  }
}
