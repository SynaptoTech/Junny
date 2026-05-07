import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { HistoryStatusGroup } from './history.service';
import { HistoryService } from './history.service';

@ApiTags('history')
@Controller('v1/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista histórico de pedidos (timeline, filtros server-side)',
  })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'q', required: false, description: 'Pesquisa em URL ou método' })
  @ApiQuery({ name: 'protocol', required: false, enum: ['REST', 'GRAPHQL', 'SOAP'] })
  @ApiQuery({ name: 'method', required: false })
  @ApiQuery({
    name: 'statusGroup',
    required: false,
    enum: ['any', '2xx', '3xx', '4xx', '5xx'],
  })
  list(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(80), ParseIntPipe) take: number,
    @Query('q') q?: string,
    @Query('protocol') protocol?: string,
    @Query('method') method?: string,
    @Query('statusGroup') statusGroup?: HistoryStatusGroup,
  ) {
    const sg =
      statusGroup &&
      ['any', '2xx', '3xx', '4xx', '5xx'].includes(statusGroup)
        ? statusGroup
        : undefined;
    return this.historyService.list(skip, take, {
      q,
      protocol,
      method,
      statusGroup: sg ?? 'any',
    });
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Elimina todo o histórico persistido' })
  deleteAll() {
    return this.historyService.deleteAll();
  }
}
