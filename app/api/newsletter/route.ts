import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const filePath = join(process.cwd(), "lib", "newsletter-subscribers.json");

interface Subscriber {
  email: string;
  subscribedAt: string;
  source: string;
}

function loadSubscribers(): Subscriber[] {
  if (!existsSync(filePath)) return [];
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const subscribers = loadSubscribers();
    return NextResponse.json({ success: true, data: subscribers, count: subscribers.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Invalid email address." }, { status: 400 });
    }

    const subscribers = loadSubscribers();

    // Check for duplicate
    if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ success: false, error: "You are already subscribed." }, { status: 409 });
    }

    const newSubscriber: Subscriber = {
      email: email.toLowerCase().trim(),
      subscribedAt: new Date().toISOString(),
      source: "footer-newsletter",
    };

    subscribers.push(newSubscriber);
    writeFileSync(filePath, JSON.stringify(subscribers, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Subscribed successfully." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();
    const subscribers = loadSubscribers();
    const filtered = subscribers.filter((s) => s.email.toLowerCase() !== email.toLowerCase());
    writeFileSync(filePath, JSON.stringify(filtered, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
