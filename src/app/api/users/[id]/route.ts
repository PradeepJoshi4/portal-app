import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";
interface Params {
    id: string;
}

export async function PUT(req: Request, context: any) {
    await connectDB();

    const { id } = await context.params; 
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const data = await req.json();
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(updatedUser);
}

export async function DELETE(req: Request, context: any) {
    await connectDB();

    const { id } = await context.params; // ✅ unwrap params
    console.log("delete id", id);

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" });
}

