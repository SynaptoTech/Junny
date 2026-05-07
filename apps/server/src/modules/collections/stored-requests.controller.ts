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
import { CreateStoredRequestDto } from './dto/create-stored-request.dto';
import { UpdateStoredRequestDto } from './dto/update-stored-request.dto';

@ApiTags('saved-requests')
@Controller('v1/saved-requests')
export class StoredRequestsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista requests guardadas sem collection (raiz)' })
  listRoot() {
    return this.collectionsService.listRootStoredRequests();
  }

  @Post()
  @ApiOperation({ summary: 'Guarda request na raiz (sem collection)' })
  createRoot(@Body() dto: CreateStoredRequestDto) {
    return this.collectionsService.addRootStoredRequest(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza request na raiz' })
  updateRoot(
    @Param('id') id: string,
    @Body() dto: UpdateStoredRequestDto,
  ) {
    return this.collectionsService.updateRootStoredRequest(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove request da raiz' })
  removeRoot(@Param('id') id: string) {
    return this.collectionsService.removeRootStoredRequest(id);
  }
}
