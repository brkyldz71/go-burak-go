import { NextResponse } from "next/server";
import { db } from "@/db";
import { socialAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accounts = await db.select().from(socialAccounts);
    // Don't return sensitive data
    const safeAccounts = accounts.map((a) => ({
      id: a.id,
      platform: a.platform,
      accountName: a.accountName,
      accountUrl: a.accountUrl,
      isConnected: a.isConnected,
      lastSyncAt: a.lastSyncAt,
      hasApiKey: !!a.apiKey,
      hasAccessToken: !!a.accessToken,
    }));
    return NextResponse.json(safeAccounts);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { platform, accountName, accountUrl, apiKey, apiSecret, accessToken, refreshToken } = body;

    const existing = await db.select().from(socialAccounts).where(eq(socialAccounts.platform, platform));
    
    if (existing.length > 0) {
      // Update existing
      const updateData: Record<string, unknown> = {
        accountName,
        accountUrl,
        updatedAt: new Date(),
      };
      
      // Only update secrets if provided (not empty)
      if (apiKey) updateData.apiKey = apiKey;
      if (apiSecret) updateData.apiSecret = apiSecret;
      if (accessToken) updateData.accessToken = accessToken;
      if (refreshToken) updateData.refreshToken = refreshToken;
      if (accountName) {
        updateData.isConnected = true;
      }

      const updated = await db
        .update(socialAccounts)
        .set(updateData)
        .where(eq(socialAccounts.platform, platform))
        .returning();
      
      return NextResponse.json({ 
        success: true, 
        account: {
          id: updated[0].id,
          platform: updated[0].platform,
          accountName: updated[0].accountName,
          isConnected: updated[0].isConnected,
        }
      });
    } else {
      // Insert new
      const inserted = await db.insert(socialAccounts).values({
        platform,
        accountName,
        accountUrl,
        apiKey,
        apiSecret,
        accessToken,
        refreshToken,
        isConnected: !!accountName,
      }).returning();

      return NextResponse.json({ 
        success: true, 
        account: {
          id: inserted[0].id,
          platform: inserted[0].platform,
          accountName: inserted[0].accountName,
          isConnected: inserted[0].isConnected,
        }
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
