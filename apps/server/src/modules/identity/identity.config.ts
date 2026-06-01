function truthy(v: string | undefined): boolean {
  if (!v) return false;
  const n = v.trim().toLowerCase();
  return n === '1' || n === 'true' || n === 'yes' || n === 'on';
}

export const identityConfig = {
  enabled: truthy(process.env.IDENTITY_ENABLED) || truthy(process.env.USE_IDENTITY_AUTH),
  apiUrl: (process.env.IDENTITY_SERVICE_URL || process.env.IDENTITY_API_URL || 'https://api-identity.synapto.com.br').replace(
    /\/$/,
    '',
  ),
  clientId: (process.env.IDENTITY_CLIENT_ID || 'junny').trim().toLowerCase(),
  clientSecret: (process.env.IDENTITY_CLIENT_SECRET || '').trim(),
  tenantSlug: (process.env.IDENTITY_TENANT_SLUG || '').trim() || undefined,
  timeoutMs: Number(process.env.IDENTITY_TIMEOUT_MS || 12_000),
};
