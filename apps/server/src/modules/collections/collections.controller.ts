import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateStoredRequestDto } from './dto/create-stored-request.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UpdateStoredRequestDto } from './dto/update-stored-request.dto';

@ApiTags('collections')
@Controller('v1/collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista collections' })
  findAll() {
    return this.collectionsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Cria collection' })
  create(@Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(dto);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplica collection e requests' })
  duplicate(@Param('id') id: string) {
    return this.collectionsService.duplicate(id);
  }

  @Post(':collectionId/requests')
  @ApiOperation({ summary: 'Salva request na collection' })
  addRequest(
    @Param('collectionId') collectionId: string,
    @Body() dto: CreateStoredRequestDto,
  ) {
    return this.collectionsService.addStoredRequest(collectionId, dto);
  }

  @Patch(':collectionId/requests/:requestId')
  @ApiOperation({ summary: 'Atualiza request guardada' })
  updateRequest(
    @Param('collectionId') collectionId: string,
    @Param('requestId') requestId: string,
    @Body() dto: UpdateStoredRequestDto,
  ) {
    return this.collectionsService.updateStoredRequest(
      collectionId,
      requestId,
      dto,
    );
  }

  @Delete(':collectionId/requests/:requestId')
  @ApiOperation({ summary: 'Remove request guardada' })
  removeRequest(
    @Param('collectionId') collectionId: string,
    @Param('requestId') requestId: string,
  ) {
    return this.collectionsService.removeStoredRequest(collectionId, requestId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém uma collection' })
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza collection' })
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collectionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove collection' })
  remove(@Param('id') id: string) {
    return this.collectionsService.remove(id);
  }
}
