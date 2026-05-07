import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { apiError } from "@/lib/api-response";
import { getPrisma } from "@/lib/prisma";
import { canUseDemoFallback, hasOpenAI, isProduction, ServiceConfigurationError } from "@/lib/runtime";

export const dynamic = "force-dynamic";

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sector: {
      type: "string",
      enum: ["Healthcare", "Technology", "Academia", "Finance", "Engineering", "Public Policy", "Creative Economy", "Entrepreneurship", "Other"],
    },
    skills: { type: "array", items: { type: "string" } },
    influence_score: { type: "number", minimum: 0, maximum: 100 },
    investment_capacity_score: { type: "number", minimum: 0, maximum: 100 },
    strategic_value_index: { type: "number", minimum: 0, maximum: 100 },
    engagement_category: {
      type: "string",
      enum: ["Investor", "Skilled Professional", "Policy Influencer", "Cultural Ambassador", "Academic Partner", "Healthcare Expert", "Technology Innovator"],
    },
    recommended_engagement_strategy: { type: "string" },
    confidence_level: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "sector",
    "skills",
    "influence_score",
    "investment_capacity_score",
    "strategic_value_index",
    "engagement_category",
    "recommended_engagement_strategy",
    "confidence_level",
  ],
};

function heuristic(raw: string) {
  const t = raw.toLowerCase();
  const sector = t.includes("doctor") || t.includes("hospital") || t.includes("health")
    ? "Healthcare"
    : t.includes("ai") || t.includes("software") || t.includes("cloud") || t.includes("data")
      ? "Technology"
      : t.includes("professor") || t.includes("research") || t.includes("university")
        ? "Academia"
        : t.includes("finance") || t.includes("invest") || t.includes("capital")
          ? "Finance"
          : t.includes("policy") || t.includes("government")
            ? "Public Policy"
            : t.includes("film") || t.includes("media")
              ? "Creative Economy"
              : "Entrepreneurship";
  const category = sector === "Healthcare"
    ? "Healthcare Expert"
    : sector === "Technology"
      ? "Technology Innovator"
      : sector === "Academia"
        ? "Academic Partner"
        : sector === "Finance"
          ? "Investor"
          : sector === "Public Policy"
            ? "Policy Influencer"
            : sector === "Creative Economy"
              ? "Cultural Ambassador"
              : "Skilled Professional";
  return {
    sector,
    skills: ["diaspora engagement", "sector leadership", "strategic partnerships"],
    influence_score: 82,
    investment_capacity_score: 76,
    strategic_value_index: 80,
    engagement_category: category,
    recommended_engagement_strategy: `Invite to a vetted ${sector} diaspora roundtable, validate consent, and match expertise to a 90-day Nigeria partnership opportunity.`,
    confidence_level: 0.72,
  };
}

async function classifyWithOpenAI(rawInput: string) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Classify a public professional profile for Nigeria diaspora engagement. Return only valid JSON that matches the schema.",
      },
      { role: "user", content: rawInput },
    ],
    response_format: { type: "json_schema", json_schema: { name: "diaspora_profile_classification", strict: true, schema } },
  });

  return JSON.parse(completion.choices[0]?.message?.content || "{}");
}

export async function POST(req: NextRequest) {
  try {
    const { rawInput } = await req.json();
    if (!rawInput || typeof rawInput !== "string") {
      return NextResponse.json({ error: "rawInput is required" }, { status: 400 });
    }

    if (!hasOpenAI && isProduction) {
      throw new ServiceConfigurationError("OpenAI is not configured for this production deployment.");
    }

    const structured = hasOpenAI ? await classifyWithOpenAI(rawInput) : heuristic(rawInput);

    try {
      const prisma = getPrisma();
      await prisma.aIClassificationLog.create({
        data: { rawInput, structuredOutput: structured, confidenceLevel: structured.confidence_level },
      });
    } catch (error) {
      if (!canUseDemoFallback) throw error;
    }

    return NextResponse.json({ data: structured, structuredOutputSchema: schema, source: hasOpenAI ? "openai" : "development-heuristic" });
  } catch (error) {
    return apiError(error, "Unable to classify profile");
  }
}
