declare module 'swagger2openapi' {
  export function convertObj(
    swagger: unknown,
    options: Record<string, unknown>,
    callback?: (err: unknown, opts?: Record<string, unknown>) => void,
  ): Promise<Record<string, unknown>>;
}
