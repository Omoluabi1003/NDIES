export const isProduction = process.env.NODE_ENV === "production";
export const hasDatabase = Boolean(process.env.DATABASE_URL);
export const canUseDemoFallback = !isProduction && !hasDatabase;
export const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

export class ServiceConfigurationError extends Error {
  constructor(message: string, public readonly status = 503) {
    super(message);
    this.name = "ServiceConfigurationError";
  }
}

export function requireDatabase() {
  if (!hasDatabase) {
    throw new ServiceConfigurationError(
      isProduction
        ? "Database is not configured for this production deployment."
        : "DATABASE_URL is not configured; development demo fallback may be used only by explicit data-service callers.",
    );
  }
}
