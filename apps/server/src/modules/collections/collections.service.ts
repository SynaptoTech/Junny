import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../config/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateStoredRequestDto } from './dto/create-stored-request.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UpdateStoredRequestDto } from './dto/update-stored-request.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.collection.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.collection.findUnique({
      where: { id },
      include: { requests: { orderBy: { updatedAt: 'desc' } } },
    });
    if (!row) throw new NotFoundException(`Collection ${id}`);
    const collAuth = row.authConfig;
    return {
      ...row,
      requests: row.requests.map((r) => ({
        ...r,
        authConfig:
          r.authConfig != null
            ? r.authConfig
            : collAuth ?? undefined,
      })),
    };
  }

  create(dto: CreateCollectionDto) {
    return this.prisma.collection.create({
      data: {
        name: dto.name,
        description: dto.description,
        authConfig:
          dto.authConfig !== undefined
            ? (dto.authConfig as unknown as Prisma.InputJsonValue)
            : undefined,
      },
    });
  }

  async update(id: string, dto: UpdateCollectionDto) {
    await this.findOne(id);
    const data: Prisma.CollectionUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.authConfig !== undefined) {
      data.authConfig =
        dto.authConfig === null
          ? Prisma.JsonNull
          : (dto.authConfig as unknown as Prisma.InputJsonValue);
    }
    return this.prisma.collection.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.collection.delete({ where: { id } });
  }

  async duplicate(id: string) {
    const src = await this.prisma.collection.findUnique({
      where: { id },
      include: { requests: true },
    });
    if (!src) throw new NotFoundException(`Collection ${id}`);
    const paramsDefault = {} as Prisma.InputJsonValue;
    const created = await this.prisma.collection.create({
      data: {
        name: `Copy of ${src.name}`,
        description: src.description,
        authConfig:
          src.authConfig !== undefined && src.authConfig !== null
            ? (src.authConfig as Prisma.InputJsonValue)
            : undefined,
        requests: {
          create: src.requests.map((r) => ({
            protocol: r.protocol ?? 'REST',
            method: r.method,
            url: r.url,
            headers: r.headers as Prisma.InputJsonValue,
            params:
              r.params !== undefined && r.params !== null
                ? (r.params as Prisma.InputJsonValue)
                : paramsDefault,
            body: r.body,
            tag: r.tag,
            graphqlVariables:
              r.graphqlVariables !== undefined && r.graphqlVariables !== null
                ? (r.graphqlVariables as Prisma.InputJsonValue)
                : undefined,
            authConfig:
              r.authConfig !== undefined && r.authConfig !== null
                ? (r.authConfig as Prisma.InputJsonValue)
                : undefined,
          })),
        },
      },
    });
    return this.findOne(created.id);
  }

  async addStoredRequest(collectionId: string, dto: CreateStoredRequestDto) {
    await this.findOne(collectionId);
    const params =
      dto.params && Object.keys(dto.params).length > 0
        ? (dto.params as Prisma.InputJsonValue)
        : ({} as Prisma.InputJsonValue);
    return this.prisma.storedRequest.create({
      data: {
        collectionId,
        protocol: dto.protocol ?? 'REST',
        method: dto.method,
        url: dto.url,
        headers: dto.headers as Prisma.InputJsonValue,
        params,
        body: dto.body ?? null,
        graphqlVariables:
          dto.graphqlVariables !== undefined
            ? (dto.graphqlVariables as Prisma.InputJsonValue)
            : undefined,
        authConfig:
          dto.authConfig !== undefined
            ? (dto.authConfig as unknown as Prisma.InputJsonValue)
            : undefined,
      },
    });
  }

  async updateStoredRequest(
    collectionId: string,
    requestId: string,
    dto: UpdateStoredRequestDto,
  ) {
    const req = await this.prisma.storedRequest.findFirst({
      where: { id: requestId, collectionId },
    });
    if (!req) {
      throw new NotFoundException(`Request ${requestId} na collection ${collectionId}`);
    }
    const data: Prisma.StoredRequestUpdateInput = {};
    if (dto.method !== undefined) data.method = dto.method;
    if (dto.url !== undefined) data.url = dto.url;
    if (dto.headers !== undefined) {
      data.headers = dto.headers as Prisma.InputJsonValue;
    }
    if (dto.params !== undefined) {
      data.params =
        Object.keys(dto.params).length > 0
          ? (dto.params as Prisma.InputJsonValue)
          : ({} as Prisma.InputJsonValue);
    }
    if (dto.body !== undefined) data.body = dto.body;
    if (dto.protocol !== undefined) data.protocol = dto.protocol;
    if (dto.graphqlVariables !== undefined) {
      data.graphqlVariables =
        dto.graphqlVariables === null
          ? Prisma.JsonNull
          : (dto.graphqlVariables as Prisma.InputJsonValue);
    }
    if (dto.authConfig !== undefined) {
      data.authConfig = dto.authConfig as unknown as Prisma.InputJsonValue;
    }
    return this.prisma.storedRequest.update({
      where: { id: requestId },
      data,
    });
  }

  async removeStoredRequest(collectionId: string, requestId: string) {
    const req = await this.prisma.storedRequest.findFirst({
      where: { id: requestId, collectionId },
    });
    if (!req) {
      throw new NotFoundException(`Request ${requestId} na collection ${collectionId}`);
    }
    return this.prisma.storedRequest.delete({ where: { id: requestId } });
  }
}
