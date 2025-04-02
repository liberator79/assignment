"use server";

import { loginSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const parsedData = loginSchema.safeParse({ email, password });
    if (!parsedData.success) {
      return { error: "Invalid input data" };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("no email");
      return { error: "Invalid email or password" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { error: "Invalid email or password" };
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return { success: "Login successful", token };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Internal server error" };
  }
}
