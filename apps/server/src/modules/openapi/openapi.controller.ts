import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImportOpenApiDto } from './dto/import-openapi.dto';
import { OpenApiImportService } from './openapi-import.service';

@ApiTags('openapi')
@Controller('v1/openapi')
export class OpenApiController {
  constructor(private readonly openApiImportService: OpenApiImportService) {}

  @Post('import')
  @ApiOperation({
    summary: 'Importar Swagger/OpenAPI',
    description:
      'Descarrega o documento, converte Swagger 2 → OpenAPI 3 quando necessário, cria environment com {{baseUrl}} e collections por tag.',
  })
  importSpec(@Body() dto: ImportOpenApiDto) {
    return this.openApiImportService.importFromUrl(dto.url);
  }
}
