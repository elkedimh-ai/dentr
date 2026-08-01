import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UPSTASH_REDIS_REST_URL = Deno.env.get("UPSTASH_REDIS_REST_URL");
const UPSTASH_REDIS_REST_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const groupId = url.searchParams.get("groupId") || "g1";
    const subgroup = url.searchParams.get("subgroup") || "All";
    const cacheKey = `schedule:${groupId}:${subgroup}`;

    // Check Redis Cache if environment variables are available
    if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
      try {
        const res = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${cacheKey}`, {
          headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
        });
        const cacheData = await res.json();
        if (cacheData.result) {
          const content = typeof cacheData.result === "string" 
            ? cacheData.result 
            : JSON.stringify(cacheData.result);
          return new Response(content, {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              "X-Cache": "HIT",
            },
          });
        }
      } catch (e) {
        console.error("Redis Cache Error:", e);
      }
    }

    return new Response(
      JSON.stringify({
        status: "ok",
        message: "Edge Function active",
        groupId,
        subgroup,
        timestamp: new Date().toISOString()
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-Cache": "MISS",
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
