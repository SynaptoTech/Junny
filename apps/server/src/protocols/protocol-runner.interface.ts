/** Contrato para engines de protocolo (REST, GraphQL, SOAP, …). */
export interface ProtocolRunner<TReq = unknown, TRes = unknown> {
  readonly id: string;
  execute(request: TReq): Promise<TRes>;
}
