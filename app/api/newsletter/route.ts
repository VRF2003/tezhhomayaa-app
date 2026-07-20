import { NextResponse } from "next/server";
import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";

export const dynamic = "force-dynamic";

interface Subscriber {
  email: string;
  subscribedAt: string;
  source: string;
}

async function loadSubscribers(): Promise<Subscriber[]> {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("newsletter");
    return (data as Subscriber[]) || [];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const subscribers = await loadSubscribers();
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

    const subscribers = await loadSubscribers();

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
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("newsletter", subscribers);

    return NextResponse.json({ success: true, message: "Subscribed successfully." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();
    const subscribers = await loadSubscribers();
    const filtered = subscribers.filter((s) => s.email.toLowerCase() !== email.toLowerCase());
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    await docRepo.saveDocument("newsletter", filtered);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
