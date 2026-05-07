import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SoapExecuteDto } from './dto/soap-execute.dto';
import { SoapProxyService } from './soap-proxy.service';

@ApiTags('soap-workspace')
@Controller('api/soap')
export class SoapRequestController {
  constructor(private readonly soapProxyService: SoapProxyService) {}

  @Post('request')
  @ApiOperation({
    summary: 'Executa pedido SOAP (workspace)',
    description:
      'POST XML ao endpoint; Content-Type por defeito text/xml; resposta como texto; histórico em SQLite.',
  })
  async execute(@Body() dto: SoapExecuteDto) {
    const result = await this.soapProxyService.execute(dto);
    return {
      success: true,
      status: result.status,
      duration: result.duration,
      headers: result.headers,
      data: result.data,
    };
  }
}
