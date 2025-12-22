import Meta from '@/models/Meta';
import { connectDB } from '@/lib/db';

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        // console.log("Slug", slug);
        if (!slug) {
            return Response.json(
                { success: false, message: 'Slug parameter is required' },
                { status: 400 }
            );
        }

        const meta = await Meta.findOne({ pageSlug: slug });
        
        if (!meta) {
            return Response.json(
                { success: false, message: 'Meta not found' },
                { status: 404 }
            );
        }
        
        return Response.json(
            { success: true, data: meta },
            { status: 200 }
        );
        
    } catch (error) {
        console.error("Error:", error);
        return Response.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
