import { NextResponse } from "next/server";
import connectMongoose from "@/lib/db/mongodb";
import SocialMedia from "@/lib/models/SocialMedia";

export async function GET() {
    try {
        await connectMongoose();
        const socials = await SocialMedia.find({}).sort({ createdAt: -1 });
        return NextResponse.json(socials);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch social media links" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectMongoose();
        const body = await request.json();

        if (!body.platform || !body.url || (!body.icon && !body.svgContent && !body.imageUrl)) {
            return NextResponse.json(
                { error: "Platform, URL, and either Icon, SVG Content, or Image URL are required" },
                { status: 400 }
            );
        }

        const social = await SocialMedia.create(body);
        return NextResponse.json(social, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to create social media link" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        await connectMongoose();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
        }

        const body = await request.json();
        const social = await SocialMedia.findByIdAndUpdate(id, body, { new: true });

        if (!social) {
            return NextResponse.json({ error: "Social media link not found" }, { status: 404 });
        }

        return NextResponse.json(social);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to update social media link" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        await connectMongoose();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
        }

        await SocialMedia.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to delete social media link" },
            { status: 500 }
        );
    }
}
