import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {

  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

  const res = NextResponse.json({ message: "Login success", user: { name: user.name, email: user.email }, token });
  res.cookies.set("token", token, { httpOnly: true });

  return res;
}
