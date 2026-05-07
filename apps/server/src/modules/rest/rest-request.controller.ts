import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProxyExecuteDto } from './dto/proxy-execute.dto';
import { ProxyService } from './proxy.service';

/** Contrato MD05 — resposta sem envelope `{ data }` do interceptor global. */
@ApiTags('rest-workspace')
@Controller('api/rest')
export class RestRequestController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post('request')
  @ApiOperation({
    summary: 'Executa request REST (workspace)',
    description:
      'Mesmo pipeline do proxy local com query params; histórico gravado no SQLite.',
  })
  async execute(@Body() dto: ProxyExecuteDto) {
    const result = await this.proxyService.execute(dto);
    return {
      success: true,
      status: result.status,
      duration: result.duration,
      headers: result.headers,
      data: result.data,
    };
  }
}
