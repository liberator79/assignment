import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { error } from "console";

const JWT_SECRET = process.env.JWT_SECRET!;
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const body = await req.json();
    const { title, description, status, isHighPrior } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newIssue = await prisma.issue.create({
      data: {
        title,
        description,
        status,
        isHighPrior,
        user: { connect: { id: decoded.userId } },
      },
    });

    return NextResponse.json(
      { success: true, data: newIssue },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { error: "Failed to create issue" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: issues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const body = await req.json();
    const { issueId } = body;

    const issue = await prisma.issue.findUnique({
      where: {
        id: issueId,
      },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    if (issue.userId !== decoded.userId) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    await prisma.issue.delete({
      where: {
        id: issueId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("Delete issue error:", e);
    return NextResponse.json(
      { error: "Failed to delete issue" },
      { status: 500 }
    );
  }
}
