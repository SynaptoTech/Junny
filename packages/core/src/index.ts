/** Tipos e constantes globais do ecossistema Junny (base do monorepo). */

export const JUNNY_PRODUCT_NAME = 'junny' as const;

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
