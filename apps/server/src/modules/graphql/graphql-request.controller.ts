import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GraphqlExecuteDto } from './dto/graphql-execute.dto';
import { GraphqlProxyService } from './graphql-proxy.service';

@ApiTags('graphql-workspace')
@Controller('api/graphql')
export class GraphqlRequestController {
  constructor(private readonly graphqlProxyService: GraphqlProxyService) {}

  @Post('request')
  @ApiOperation({
    summary: 'Executa pedido GraphQL (workspace)',
    description:
      'POST JSON { query, variables } ao endpoint; histórico em SQLite; mesma resposta plana que REST em /api.',
  })
  async execute(@Body() dto: GraphqlExecuteDto) {
    const result = await this.graphqlProxyService.execute(dto);
    return {
      success: true,
      status: result.status,
      duration: result.duration,
      headers: result.headers,
      data: result.data,
    };
  }
}
