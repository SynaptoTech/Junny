import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ImportOpenApiDto {
  @ApiProperty({
    example: 'https://petstore.swagger.io/v2/swagger.json',
    description: 'URL do documento OpenAPI / Swagger (JSON ou YAML)',
  })
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  url!: string;
}
