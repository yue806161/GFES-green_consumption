import { getPlatformDb, getPublicPlatformContent } from "../../../db/platform";

export async function GET() {
  try {
    const db = await getPlatformDb();
    return Response.json(await getPublicPlatformContent(db), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "公開內容讀取失敗" }, { status: 503 });
  }
}
