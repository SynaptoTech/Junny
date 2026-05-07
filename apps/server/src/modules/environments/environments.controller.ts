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
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { EnvironmentsService } from './environments.service';

@ApiTags('environments')
@Controller('v1/environments')
export class EnvironmentsController {
  constructor(private readonly environmentsService: EnvironmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista environments' })
  findAll() {
    return this.environmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém um environment' })
  findOne(@Param('id') id: string) {
    return this.environmentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria environment' })
  create(@Body() dto: CreateEnvironmentDto) {
    return this.environmentsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza environment' })
  update(@Param('id') id: string, @Body() dto: UpdateEnvironmentDto) {
    return this.environmentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove environment' })
  remove(@Param('id') id: string) {
    return this.environmentsService.remove(id);
  }
}
