"use server";

import { signUpSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function signUpAction(formData: FormData) {
  const secret = process.env.JWT_SECRET;
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const userName = formData.get("userName") as string;

    const parsedData = signUpSchema.safeParse({ email, password, userName });
    if (!parsedData.success) {
      return { error: "Invalid input data" };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "User already exists. Please log in." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userName,
      },
    });

    return { success: "User created" };
  } catch (error) {
    console.error("Sign-up error:", error);
    return { error: "Internal server error" };
  }
}
