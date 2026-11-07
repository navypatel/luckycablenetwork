export function isAdminConfigured(environment: NodeJS.ProcessEnv = process.env) {
  return Boolean(environment.MONGODB_URI?.trim() && environment.MONGODB_DB?.trim() && environment.SESSION_SECRET && environment.SESSION_SECRET.length >= 32 && !environment.SESSION_SECRET.startsWith("REPLACE_"));
}