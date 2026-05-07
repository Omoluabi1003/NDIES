import { NextResponse } from "next/server";
import { ServiceConfigurationError, isProduction } from "./runtime";

export function apiError(error: unknown, fallbackMessage = "Request failed") {
  if (error instanceof ServiceConfigurationError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(error);
  return NextResponse.json(
    { error: isProduction ? fallbackMessage : error instanceof Error ? error.message : fallbackMessage },
    { status: 500 },
  );
}
