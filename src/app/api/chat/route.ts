import { getApp } from "@/actions/get-app";
import { freestyle } from "@/lib/freestyle";
import { getAppIdFromHeaders } from "@/lib/utils";
import { MCPClient } from "@mastra/mcp";
import { builderAgent } from "@/mastra/agents/builder";
import { deleteStream, getStream, setStream } from "@/lib/streams";
import { CoreMessage } from "@mastra/core";

import { getUser } from "@/auth/stack-auth";
import { openRouterClaude } from "@/lib/openrouter";

// "fix" mastra mcp bug
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 1000;

export async function POST(req: Request) {
  const appId = getAppIdFromHeaders(req);

  if (!appId) {
    return new Response("Missing App Id header", { status: 400 });
  }

  const app = await getApp(appId);
  if (!app) {
    return new Response("App not found", { status: 404 });
  }

  const existingStream = await getStream(appId);
  if (existingStream) {
    const [stream1, stream2] = streams[appId].readable.tee();
    streams[appId] = { readable: stream2, prompt: streams[appId].prompt };
    return new Response(stream1, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const { mcpEphemeralUrl, ephemeralUrl } = await freestyle.requestDevServer({
    repoId: app.info.gitRepo,
    baseId: app.info.baseId,
  });

  const { message }: { message: CoreMessage } = await req.json();

  const mcp = new MCPClient({
    id: crypto.randomUUID(),
    servers: {
      dev_server: {
        url: new URL(mcpEphemeralUrl),
      },
    },
  });

  const toolsets = await mcp.getToolsets();

  const rootStream = new TransformStream();

  let fixCount = 0;

  async function runAgent(prompt: any) {
    // NEW: get userId
    const { userId } = await getUser();

    // NEW: normalize prompt to string
    let finalPrompt: string = "";

    if (typeof prompt === "string") {
      finalPrompt = prompt;
    } else if (Array.isArray(prompt)) {
      finalPrompt = prompt.map((p: any) => {
        if (p.type === "text") return p.text;
        if (p.content) return p.content;
        return "";
      }).join("\n");
    } else {
      finalPrompt = "";
    }

    try {
      // NEW: call OpenRouter Claude
      const result = await openRouterClaude().generateContent(finalPrompt, userId);

      // stream result into the rootStream, so your existing logic works the same
      const writer = rootStream.writable.getWriter();

      writer.write(new TextEncoder().encode(result.content));
      writer.close();

      console.log("Stream ended");

    } catch (error: any) {
      console.error(" Error in Claude or credit logic:", error);

      const writer = rootStream.writable.getWriter();

      const message = error?.message?.includes("No credits")
        ? " You're out of credits. Please upgrade your plan."
        : " Something went wrong. Please try again.";

      writer.write(new TextEncoder().encode(message));
      writer.close();
    }
  }

  runAgent(message.content);

  const [stream1, stream2] = rootStream.readable.tee();
  await setStream(appId, stream2, message.content);

  return new Response(stream1, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function GET(req: Request) {
  const appId = getAppIdFromHeaders(req);
  if (!appId) {
    return new Response("Missing App Id header", { status: 400 });
  }

  return new Response(
    JSON.stringify({
      stream: streams[appId] && {
        prompt: streams[appId].prompt,
      },
    })
  );
}


