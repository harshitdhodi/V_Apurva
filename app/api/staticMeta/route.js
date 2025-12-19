import { connectDB } from "@/lib/db";
import Meta from "@/lib/models/StaticMeta";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    const meta = await Meta.findOne({ pageSlug: slug });
    if (!meta) {
      return Response.json({ success: false, message: "Meta not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: meta });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
