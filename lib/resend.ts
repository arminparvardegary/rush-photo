import { Resend } from 'resend';

// Defer client initialization to avoid build-time errors
function getResendClient(): Resend {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error('RESEND_API_KEY environment variable is not set');
    }
    return new Resend(apiKey);
}

export async function sendEmail({
    to,
    subject,
    html,
    text,
    from,
}: {
    to: string;
    subject: string;
    html: string;
    text: string;
    from?: string;
}): Promise<string | null> {
    try {
        const resend = getResendClient();
        const { data, error } = await resend.emails.send({
            from: from || `Rush Photo <${process.env.EMAIL_FROM || 'hello@rush.photos'}>`,
            to: [to],
            subject,
            html,
            text,
        });

        if (error) {
            console.error('Resend error:', error);
            return null;
        }

        return data?.id || null;
    } catch (error) {
        console.error('Error sending email via Resend:', error);
        return null;
    }
}
