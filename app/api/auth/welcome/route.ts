import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const htmlContent = `
      <div style="font-family: 'Times New Roman', Times, serif; color: #1a1a18; max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center;">
        <h1 style="font-family: monospace; letter-spacing: 0.2em; font-weight: 300; text-transform: uppercase; margin-bottom: 40px;">Tezhhomayaa</h1>
        <h2 style="font-size: 24px; font-weight: 400; margin-bottom: 20px;">Welcome to Form Beyond Motion${name ? `, ${name}` : ''}</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4845; margin-bottom: 30px;">
          Your account has been successfully created. You now have priority access to our latest collections, exclusive editorial content, and the ability to seamlessly track your orders.
        </p>
        <div style="margin: 40px 0; border-top: 1px solid #e8e6e1; padding-top: 40px;">
          <a href="https://tezhhomayaa-app.vercel.app" style="display: inline-block; background-color: #1a1a18; color: #ffffff; padding: 15px 30px; text-decoration: none; font-family: monospace; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">Explore Collections</a>
        </div>
        <p style="font-size: 14px; color: #9a9690; margin-top: 40px; font-style: italic;">
          "Where art becomes movement."
        </p>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Tezhhomayaa <onboarding@resend.dev>', // Resend testing email
      to: [email],
      subject: 'Welcome to Tezhhomayaa',
      html: htmlContent,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
