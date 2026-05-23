// @ts-nocheck — Deno runtime. The Node.js TS server cannot resolve npm: specifiers or Deno globals.
// Type-check with the VS Code Deno extension + Deno language server.

/**
 * Supabase Edge Function — calculate-disc
 *
 * POST /functions/v1/calculate-disc
 *
 * INPUT
 * {
 *   "respondent": "Jane Doe",
 *   "email": "jane@acme.com",
 *   "answers": [
 *     {
 *       "scenario": 1,
 *       "options": [
 *         { "type": "D", "selected": "Most" },
 *         { "type": "I", "selected": null },
 *         { "type": "S", "selected": "Least" },
 *         { "type": "C", "selected": null }
 *       ]
 *     }
 *     // … 27 more
 *   ]
 * }
 *
 * SCORING — three independent graphs
 *   Graph 1 (Public)    input per type: mostCount[type]      (0–28)
 *   Graph 2 (Private)   input per type: leastCount[type]     (0–28)
 *   Graph 3 (Perceived) input per type: perceived[type]      (-28 to +28)
 *   perceived[type] = mostCount[type] − leastCount[type]
 *
 * Each graph/type combination has its own hardcoded lookup table.
 * Exact key match; fall back to 2 if key is missing.
 * percent[type] = intensity[type] / 28
 *
 * PROFILE — derived independently from each graph
 *   Sort types by percent DESC → concatenate top-2 as profile key
 *   e.g. "CS", "DI", "SD" → look up label from PROFILE_LABELS
 *
 * ALIGNMENT — compare primary type (first char) of all three profiles
 */

import { createClient } from "npm:@supabase/supabase-js@2";

// ─── CORS ─────────────────────────────────────────────────────────────────────

const CORS: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Dim = "D" | "I" | "S" | "C";
type Selection = "Most" | "Least" | null;

interface OptionEntry {
  type: Dim;
  selected: Selection;
}

interface ScenarioAnswer {
  scenario: number;
  options: OptionEntry[];
}

interface RequestBody {
  respondent: string;
  email: string;
  answers: ScenarioAnswer[];
}

interface DimScores {
  D: number;
  I: number;
  S: number;
  C: number;
}

interface DimResult {
  most: number;
  least: number;
  perceived: number;
  public_intensity: number;
  public_percent: number;
  private_intensity: number;
  private_percent: number;
  perceived_intensity: number;
  perceived_percent: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DIMS: Dim[] = ["D", "I", "S", "C"];
const TOTAL = 28;

// ─── Intensity Lookup Tables ──────────────────────────────────────────────────
// Exact values from spec. Do NOT interpolate — use exact key match; fallback 2.

const G1: Record<Dim, Record<number, number>> = {
  D: {
    28: 28, 27: 27, 26: 27, 25: 27, 24: 27, 23: 27, 22: 27, 21: 27, 20: 27,
    19: 27, 18: 27, 17: 27, 16: 27, 15: 26.5, 14: 26.5, 13: 26.5, 12: 26.25,
    11: 25.25, 10: 24, 9: 22.75, 8: 22.25, 7: 20, 6: 19, 5: 16, 4: 14, 3: 12,
    2: 9.25, 1: 5.5, 0: 2.75,
  },
  I: {
    28: 28, 27: 27, 26: 27, 25: 27, 24: 27, 23: 27, 22: 27, 21: 27, 20: 27,
    19: 27, 18: 27, 17: 27, 16: 27, 15: 26.75, 14: 26.75, 13: 26.75, 12: 26,
    11: 25, 10: 23.75, 9: 22, 8: 20, 7: 16, 6: 14.75, 5: 12, 4: 9.25, 3: 6,
    2: 3.75, 1: 2, 0: 1,
  },
  S: {
    28: 28, 27: 27, 26: 27, 25: 27, 24: 27, 23: 27, 22: 27, 21: 27, 20: 27,
    19: 27, 18: 27, 17: 27, 16: 27, 15: 24.25, 14: 24.25, 13: 24.25,
    12: 23.25, 11: 21.25, 10: 19.25, 9: 17.25, 8: 15.25, 7: 13.25, 6: 10.75,
    5: 9.5, 4: 6.75, 3: 4.25, 2: 3.25, 1: 2.25, 0: 1.25,
  },
  C: {
    28: 28, 27: 27, 26: 27, 25: 27, 24: 27, 23: 27, 22: 27, 21: 27, 20: 27,
    19: 27, 18: 27, 17: 27, 16: 27, 15: 27, 14: 24, 13: 24, 12: 24, 11: 24,
    10: 23, 9: 23.25, 8: 21, 7: 18.75, 6: 15.75, 5: 13, 4: 9.5, 3: 7,
    2: 3.75, 1: 1.75, 0: 1,
  },
};

const G2: Record<Dim, Record<number, number>> = {
  D: {
    0: 28, 1: 27.25, 2: 26.5, 3: 25.75, 4: 25.5, 5: 24, 6: 22.25, 7: 21.25,
    8: 19.5, 9: 18, 10: 13.5, 11: 12, 12: 10.75, 13: 9.25, 14: 6.75,
    15: 5.25, 16: 4, 17: 3.25, 18: 2, 19: 2, 20: 2, 21: 2, 22: 2, 23: 2,
    24: 2, 25: 2, 26: 2, 27: 2, 28: 1,
  },
  I: {
    0: 28, 1: 26.25, 2: 25, 3: 23.25, 4: 20, 5: 16, 6: 12, 7: 9.5, 8: 6.75,
    9: 4, 10: 3, 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 2, 17: 2, 18: 2,
    19: 2, 20: 2, 21: 2, 22: 2, 23: 2, 24: 2, 25: 2, 26: 2, 27: 2, 28: 1,
  },
  S: {
    0: 28, 1: 26, 2: 21.75, 3: 18.25, 4: 15.25, 5: 12, 6: 9, 7: 7.25,
    8: 5.25, 9: 4, 10: 2.25, 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 2,
    17: 2, 18: 2, 19: 2, 20: 2, 21: 2, 22: 2, 23: 2, 24: 2, 25: 2, 26: 2,
    27: 2, 28: 1,
  },
  C: {
    0: 28, 1: 27, 2: 26.25, 3: 25.25, 4: 23.75, 5: 21.75, 6: 19.5, 7: 16,
    8: 13.5, 9: 10.75, 10: 7.5, 11: 5.5, 12: 3.75, 13: 2.75, 14: 2, 15: 2,
    16: 2, 17: 2, 18: 2, 19: 2, 20: 2, 21: 2, 22: 2, 23: 2, 24: 2, 25: 2,
    26: 2, 27: 2, 28: 1,
  },
};

// Graph 3 uses perceived score as key: -28 to +28
const G3: Record<Dim, Record<number, number>> = {
  D: {
    28: 28, 27: 27, 26: 27, 25: 27, 24: 27, 23: 27, 22: 27, 21: 27, 20: 27,
    19: 27, 18: 27, 17: 27, 16: 27, 15: 27, 14: 27, 13: 27, 12: 27, 11: 27,
    10: 27, 9: 26, 8: 25.5, 7: 25.5, 6: 25, 5: 24.5, 4: 23.5, 3: 23.25,
    2: 22.5, 1: 21.75, 0: 21, [-1]: 20, [-2]: 19.25, [-3]: 18.5, [-4]: 17.5,
    [-5]: 16, [-6]: 14.75, [-7]: 14, [-8]: 12, [-9]: 11.25, [-10]: 10.5,
    [-11]: 9.25, [-12]: 8, [-13]: 6.75, [-14]: 5.75, [-15]: 3.75,
    [-16]: 2.75, [-17]: 2, [-18]: 2, [-19]: 2, [-20]: 2, [-21]: 2, [-22]: 2,
    [-23]: 2, [-24]: 2, [-25]: 2, [-26]: 2, [-27]: 2, [-28]: 1,
  },
  I: {
    28: 28, 27: 27, 26: 27, 25: 27, 24: 27, 23: 27, 22: 27, 21: 27, 20: 27,
    19: 27, 18: 27, 17: 27, 16: 27, 15: 27, 14: 27, 13: 27, 12: 27, 11: 27,
    10: 27, 9: 26, 8: 25, 7: 23.75, 6: 21.5, 5: 20.25, 4: 19, 3: 17.5,
    2: 15.75, 1: 14.5, 0: 12.25, [-1]: 11.25, [-2]: 9.75, [-3]: 8,
    [-4]: 6.75, [-5]: 5.75, [-6]: 4, [-7]: 3.5, [-8]: 3, [-9]: 2, [-10]: 2,
    [-11]: 2, [-12]: 2, [-13]: 2, [-14]: 2, [-15]: 2, [-16]: 2, [-17]: 2,
    [-18]: 2, [-19]: 2, [-20]: 2, [-21]: 2, [-22]: 2, [-23]: 2, [-24]: 2,
    [-25]: 2, [-26]: 2, [-27]: 2, [-28]: 1,
  },
  S: {
    28: 28, 27: 27, 26: 27, 25: 27, 24: 27, 23: 27, 22: 27, 21: 27, 20: 27,
    19: 27, 18: 27, 17: 27, 16: 27, 15: 27, 14: 26.75, 13: 26, 12: 25,
    11: 23.75, 10: 22.5, 9: 21, 8: 20, 7: 18.75, 6: 17.25, 5: 15.25,
    4: 14.5, 3: 13.75, 2: 12, 1: 11.25, 0: 9.75, [-1]: 8, [-2]: 7,
    [-3]: 6.5, [-4]: 5, [-5]: 4, [-6]: 3.5, [-7]: 3, [-8]: 2, [-9]: 2,
    [-10]: 2, [-11]: 2, [-12]: 2, [-13]: 2, [-14]: 2, [-15]: 2, [-16]: 2,
    [-17]: 2, [-18]: 2, [-19]: 2, [-20]: 2, [-21]: 2, [-22]: 2, [-23]: 2,
    [-24]: 2, [-25]: 2, [-26]: 2, [-27]: 2, [-28]: 1,
  },
  C: {
    28: 28, 27: 27, 26: 27, 25: 27, 24: 27, 23: 27, 22: 27, 21: 27, 20: 27,
    19: 27, 18: 27, 17: 26, 16: 26, 15: 26, 14: 26, 13: 26, 12: 26, 11: 26,
    10: 26, 9: 26, 8: 26, 7: 26, 6: 25, 5: 23.75, 4: 22.5, 3: 21, 2: 19.75,
    1: 18.75, 0: 18, [-1]: 16, [-2]: 14.75, [-3]: 12, [-4]: 11, [-5]: 9.5,
    [-6]: 8, [-7]: 6.75, [-8]: 5, [-9]: 4, [-10]: 3.5, [-11]: 2.5, [-12]: 2,
    [-13]: 2, [-14]: 2, [-15]: 2, [-16]: 2, [-17]: 2, [-18]: 2, [-19]: 2,
    [-20]: 2, [-21]: 2, [-22]: 2, [-23]: 2, [-24]: 2, [-25]: 2, [-26]: 2,
    [-27]: 2, [-28]: 1,
  },
};

// ─── Profile Labels ───────────────────────────────────────────────────────────

const PROFILE_LABELS: Record<string, string> = {
  D:  "THE OPPORTUNIST",
  DI: "THE DIRECTOR",
  DS: "THE PRODUCER",
  DC: "THE PIONEER",
  I:  "THE NETWORKER",
  ID: "THE PERSUADER",
  IS: "THE COACH",
  IC: "THE STRATEGIST",
  S:  "THE SUPPORTER",
  SD: "THE SELF-STARTER",
  SI: "THE HARMONISER",
  SC: "THE RESEARCHER",
  C:  "THE ANALYSER",
  CD: "THE INNOVATOR",
  CI: "THE EXPERT",
  CS: "THE PERFECTIONIST",
};

// ─── Step 1: Validation ───────────────────────────────────────────────────────

function validate(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return "Request body must be a JSON object";

  const { respondent, email, answers } = body as Record<string, unknown>;

  if (!respondent || typeof respondent !== "string" || respondent.trim() === "") {
    return "respondent is required (non-empty string)";
  }
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "email is required and must be a valid email address";
  }
  if (!Array.isArray(answers)) return "answers must be an array";
  if (answers.length !== TOTAL)  return `answers must contain exactly ${TOTAL} scenarios, got ${answers.length}`;

  const seenScenarios = new Set<number>();

  for (let i = 0; i < answers.length; i++) {
    const item = answers[i];
    if (typeof item !== "object" || item === null) return `answers[${i}]: must be an object`;

    const { scenario, options } = item as Record<string, unknown>;

    if (typeof scenario !== "number" || !Number.isInteger(scenario) || scenario < 1 || scenario > TOTAL) {
      return `answers[${i}]: scenario must be an integer 1–${TOTAL}, got ${String(scenario)}`;
    }
    if (seenScenarios.has(scenario)) return `answers[${i}]: duplicate scenario ${scenario}`;
    seenScenarios.add(scenario);

    if (!Array.isArray(options) || options.length !== 4) {
      return `Scenario ${scenario}: options must be an array of exactly 4 items`;
    }

    let mostCount  = 0;
    let leastCount = 0;
    let mostType:  Dim | null = null;
    let leastType: Dim | null = null;
    const seenTypes = new Set<string>();

    for (let j = 0; j < 4; j++) {
      const opt = options[j];
      if (typeof opt !== "object" || opt === null) {
        return `Scenario ${scenario}, option ${j}: must be an object`;
      }
      const { type, selected } = opt as Record<string, unknown>;

      if (!["D", "I", "S", "C"].includes(type as string)) {
        return `Scenario ${scenario}, option ${j}: type must be D, I, S, or C`;
      }
      if (seenTypes.has(type as string)) {
        return `Scenario ${scenario}: duplicate type "${String(type)}"`;
      }
      seenTypes.add(type as string);

      if (selected !== "Most" && selected !== "Least" && selected !== null) {
        return `Scenario ${scenario}, type ${String(type)}: selected must be "Most", "Least", or null`;
      }
      if (selected === "Most")  { mostCount++;  mostType  = type as Dim; }
      if (selected === "Least") { leastCount++; leastType = type as Dim; }
    }

    if (mostCount  !== 1) return `Scenario ${scenario}: exactly 1 option must be selected as "Most", found ${mostCount}`;
    if (leastCount !== 1) return `Scenario ${scenario}: exactly 1 option must be selected as "Least", found ${leastCount}`;
    if (mostType === leastType) return `Scenario ${scenario}: the same type cannot be both "Most" and "Least"`;
  }

  return null;
}

// ─── Step 2: Count Most / Least per dimension ─────────────────────────────────

function countSelections(answers: ScenarioAnswer[]): { mostCount: DimScores; leastCount: DimScores } {
  const mostCount:  DimScores = { D: 0, I: 0, S: 0, C: 0 };
  const leastCount: DimScores = { D: 0, I: 0, S: 0, C: 0 };

  for (const { options } of answers) {
    for (const { type, selected } of options) {
      if (selected === "Most")  mostCount[type]++;
      if (selected === "Least") leastCount[type]++;
    }
  }

  return { mostCount, leastCount };
}

// ─── Step 3: Intensity lookup ─────────────────────────────────────────────────

function lookup(table: Record<number, number>, key: number): number {
  return key in table ? table[key] : 2;
}

// ─── Step 4: Profile derivation ───────────────────────────────────────────────

/**
 * Sorts the 4 DISC types by their intensity descending and returns a
 * 2-letter profile key (top-1 + top-2) plus its label.
 * Falls back to top-1 alone if the 2-letter key is missing from PROFILE_LABELS.
 */
function deriveProfile(intensities: DimScores): { profile: string; label: string } {
  const ranked = (["D", "I", "S", "C"] as Dim[]).sort(
    (a, b) => intensities[b] - intensities[a] || ["D", "I", "S", "C"].indexOf(a) - ["D", "I", "S", "C"].indexOf(b)
  );

  const key2 = `${ranked[0]}${ranked[1]}`;
  const key1 = ranked[0];

  const profile = key2 in PROFILE_LABELS ? key2 : key1;
  const label   = PROFILE_LABELS[profile] ?? profile;

  return { profile, label };
}

// ─── Step 5: Alignment type ───────────────────────────────────────────────────

interface AlignmentResult {
  alignment_type: string;
  stress_scale:   number;
}

function computeAlignment(
  pubProfile:  string,
  privProfile: string,
  percProfile: string,
): AlignmentResult {
  const pub  = pubProfile[0];
  const priv = privProfile[0];
  const perc = percProfile[0];

  if (pub === priv && priv === perc) {
    // All three primaries agree — check secondaries
    const pubS  = pubProfile[1]  ?? "";
    const privS = privProfile[1] ?? "";
    const percS = percProfile[1] ?? "";
    if (pubS === privS && privS === percS) {
      return { alignment_type: "Aligned",          stress_scale: 0.05 };
    }
    return { alignment_type: "Minor Adaptation",   stress_scale: 0.25 };
  }

  if (pub === perc && pub !== priv) return { alignment_type: "Adaptation Gap",     stress_scale: 0.60 };
  if (pub === priv && pub !== perc) return { alignment_type: "Perception Gap",      stress_scale: 0.35 };
  if (priv === perc && pub !== priv) return { alignment_type: "Double Gap",         stress_scale: 0.70 };

  return { alignment_type: "Conflict or Stress", stress_scale: 0.95 };
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST")    return jsonRes({ error: "Method not allowed" }, 405);

  // ── Environment ───────────────────────────────────────────────────────────
  const supabaseUrl    = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("calculate-disc: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
    return jsonRes({ error: "Server configuration error" }, 500);
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return jsonRes({ error: "Request body must be valid JSON" }, 400);
  }

  // ── Validate ─────────────────────────────────────────────────────────────
  const validationError = validate(body);
  if (validationError) {
    return jsonRes({ error: validationError }, 422);
  }

  // ── Step 1 — Count selections ─────────────────────────────────────────────
  const { mostCount, leastCount } = countSelections(body.answers);

  // Sanity check (should always pass after validation)
  const mostTotal  = DIMS.reduce((s, d) => s + mostCount[d],  0);
  const leastTotal = DIMS.reduce((s, d) => s + leastCount[d], 0);
  if (mostTotal !== TOTAL || leastTotal !== TOTAL) {
    return jsonRes({ error: `Internal: most sum=${mostTotal}, least sum=${leastTotal}` }, 500);
  }

  // ── Step 2 — Perceived score ──────────────────────────────────────────────
  const perceived: DimScores = {
    D: mostCount.D - leastCount.D,
    I: mostCount.I - leastCount.I,
    S: mostCount.S - leastCount.S,
    C: mostCount.C - leastCount.C,
  };

  // ── Step 3 — Intensity lookups ────────────────────────────────────────────
  const pubIntensity:  DimScores = { D: 0, I: 0, S: 0, C: 0 };
  const privIntensity: DimScores = { D: 0, I: 0, S: 0, C: 0 };
  const percIntensity: DimScores = { D: 0, I: 0, S: 0, C: 0 };

  for (const d of DIMS) {
    pubIntensity[d]  = lookup(G1[d], mostCount[d]);
    privIntensity[d] = lookup(G2[d], leastCount[d]);
    percIntensity[d] = lookup(G3[d], perceived[d]);
  }

  // ── Step 4 — Percentiles (intensity / 28) & per-dimension result ──────────
  const scores: Record<Dim, DimResult> = {} as Record<Dim, DimResult>;

  for (const d of DIMS) {
    scores[d] = {
      most:                mostCount[d],
      least:               leastCount[d],
      perceived:           perceived[d],
      public_intensity:    pubIntensity[d],
      public_percent:      round3(pubIntensity[d]  / TOTAL),
      private_intensity:   privIntensity[d],
      private_percent:     round3(privIntensity[d] / TOTAL),
      perceived_intensity: percIntensity[d],
      perceived_percent:   round3(percIntensity[d] / TOTAL),
    };
  }

  // ── Step 5 — Profile derivation per graph ─────────────────────────────────
  const { profile: publicProfile,    label: publicLabel    } = deriveProfile(pubIntensity);
  const { profile: privateProfile,   label: privateLabel   } = deriveProfile(privIntensity);
  const { profile: perceivedProfile, label: perceivedLabel } = deriveProfile(percIntensity);

  // ── Step 6 — Alignment type ───────────────────────────────────────────────
  const { alignment_type, stress_scale } = computeAlignment(
    publicProfile, privateProfile, perceivedProfile,
  );

  // ── Persist to disc_results ───────────────────────────────────────────────
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { error: dbErr } = await admin.from("disc_results").insert({
    respondent_name:   body.respondent,
    respondent_email:  body.email,
    scores,
    public_profile:    publicProfile,
    public_label:      publicLabel,
    private_profile:   privateProfile,
    private_label:     privateLabel,
    perceived_profile: perceivedProfile,
    perceived_label:   perceivedLabel,
    alignment_type,
    stress_scale,
  });

  if (dbErr) {
    console.error("calculate-disc DB error:", dbErr.message);
    return jsonRes({ error: `Failed to save result: ${dbErr.message}` }, 500);
  }

  // ── Return full DISC profile ──────────────────────────────────────────────
  return jsonRes({
    success: true,
    result: {
      respondent:        body.respondent,
      email:             body.email,
      scores,
      public_profile:    publicProfile,
      public_label:      publicLabel,
      private_profile:   privateProfile,
      private_label:     privateLabel,
      perceived_profile: perceivedProfile,
      perceived_label:   perceivedLabel,
      alignment_type,
      stress_scale,
    },
  });
});

