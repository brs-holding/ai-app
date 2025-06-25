// app/api/credits/route.ts
import { getUser } from "@/auth/stack-auth";
import { db } from "@/lib/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import { NextResponse } from "next/server";




export async function GET() {
  try {
    const { userId } = await getUser();


    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(
      JSON.stringify({
        plan: user.plan,
        creditsRemaining: user.creditsRemaining,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return new Response("Internal error", { status: 500 });
  }

  
}


