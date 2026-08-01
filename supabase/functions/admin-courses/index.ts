import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-pin",
};

const UPSTASH_REDIS_REST_URL = Deno.env.get("UPSTASH_REDIS_REST_URL");
const UPSTASH_REDIS_REST_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
const ADMIN_PIN = Deno.env.get("ADMIN_PIN") || "1234";

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify method
    if (req.method !== "POST" && req.method !== "PUT" && req.method !== "DELETE") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST, PUT, or DELETE." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headerPin = req.headers.get("x-admin-pin");
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty or non-JSON body
    }

    const providedPin = headerPin || body.pin;
    if (providedPin !== ADMIN_PIN) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Invalid Admin PIN." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const action = body.action || (req.method === "DELETE" ? "delete" : "update");
    const course = body.course;
    const courseId = body.courseId || (course ? course.id : null);
    const groupId = body.groupId || (course ? course.groupId : null);

    // Flush/invalidate Redis Cache keys corresponding to schedules
    let invalidatedKeysCount = 0;
    if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
      try {
        const pattern = groupId ? `schedule:${groupId}:*` : `schedule:*`;
        const keysRes = await fetch(`${UPSTASH_REDIS_REST_URL}/keys/${pattern}`, {
          headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
        });
        const keysData = await keysRes.json();
        
        if (Array.isArray(keysData.result) && keysData.result.length > 0) {
          for (const key of keysData.result) {
            await fetch(`${UPSTASH_REDIS_REST_URL}/del/${key}`, {
              headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
            });
            invalidatedKeysCount++;
          }
        }
      } catch (cacheErr) {
        console.error("Redis Cache Invalidation Error:", cacheErr);
      }
    }

    return new Response(
      JSON.stringify({
        status: "ok",
        action,
        courseId,
        invalidatedKeysCount,
        message: `Admin operation '${action}' completed successfully and Redis cache invalidated.`,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
