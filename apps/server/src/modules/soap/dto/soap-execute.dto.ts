import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { RequestAuthDto } from '../../auth/dto/request-auth.dto';

/** Limite do envelope SOAP em caracteres. */
export const MAX_SOAP_XML_CHARS = 500_000;

export class SoapExecuteDto {
  @ApiProperty({ example: 'https://api.example.com/soap' })
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  url!: string;

  @ApiProperty({
    description: 'Corpo do pedido (envelope SOAP XML)',
    example: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body/></soapenv:Envelope>',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_SOAP_XML_CHARS)
  xml!: string;

  @ApiPropertyOptional({
    description: 'Cabeçalhos HTTP (SOAPAction, Authorization, Content-Type, …)',
  })
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Resolve {{variáveis}} em URL, XML e headers.',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  environmentId?: string;

  @ApiPropertyOptional({
    description:
      'Autenticação aplicada após substituição do ambiente (Authorization / API Key).',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RequestAuthDto)
  auth?: RequestAuthDto;
}
