import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProxyExecuteDto } from './dto/proxy-execute.dto';
import { ProxyService } from './proxy.service';

@ApiTags('proxy')
@Controller('v1/proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post('execute')
  @ApiOperation({
    summary: 'Proxy HTTP local',
    description:
      'Encaminha o request ao destino (Axios), contorna CORS no browser e registra histórico.',
  })
  execute(@Body() dto: ProxyExecuteDto) {
    return this.proxyService.execute(dto);
  }
}
