type MailtoOptions = { to: string; subject?: string; body?: string };

/** Arma un link `mailto:` con asunto y cuerpo codificados. */
export function buildMailto({ to, subject, body }: MailtoOptions): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${to}${params.length ? `?${params.join("&")}` : ""}`;
}
