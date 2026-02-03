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
        console.log(`Sending email to: ${to}, subject: ${subject}`);

        const resend = getResendClient();
        const fromEmail = from || `Rush Photos <${process.env.EMAIL_FROM || 'hello@rush.photos'}>`;

        console.log(`Using from address: ${fromEmail}`);

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [to],
            subject,
            html,
            text,
        });

        if (error) {
            console.error('Resend API error:', JSON.stringify(error, null, 2));
            return null;
        }

        console.log(`Email sent successfully. ID: ${data?.id}`);
        return data?.id || null;
    } catch (error) {
        console.error('Error sending email via Resend:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message, error.stack);
        }
        return null;
    }
}
