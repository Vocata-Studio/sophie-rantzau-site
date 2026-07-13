import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO;

  if (!apiKey || !to) {
    return new Response(JSON.stringify({ error: 'config' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // honeypot
  if (typeof payload.botField === 'string' && payload.botField.trim() !== '') {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'missing' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (name.length > 200 || email.length > 200 || phone.length > 50 || message.length > 5000) {
    return new Response(JSON.stringify({ error: 'length' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(apiKey);

  const subject = `Ny henvendelse fra ${name} – sophierantzau.dk`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #161c1a;">
      <h2 style="margin: 0 0 16px;">Ny besked fra kontaktformularen</h2>
      <p><strong>Navn:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      ${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ''}
      <p><strong>Besked:</strong></p>
      <div style="white-space: pre-wrap; padding: 12px 16px; background: #f3f6f4; border-left: 3px solid #9fb39c;">${escapeHtml(message)}</div>
    </div>
  `;
  const text = [
    `Navn: ${name}`,
    `Email: ${email}`,
    phone ? `Telefon: ${phone}` : null,
    '',
    'Besked:',
    message,
  ]
    .filter(Boolean)
    .join('\n');

  const { error } = await resend.emails.send({
    from: 'Website Form Submission <noreply@noreply.vocata.studio>',
    to,
    replyTo: email,
    subject,
    html,
    text,
  });

  if (error) {
    console.error('Resend error:', error);
    return new Response(JSON.stringify({ error: 'send' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
