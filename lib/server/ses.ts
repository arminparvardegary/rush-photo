import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const command = new SendEmailCommand({
        Source: process.env.AWS_SES_FROM_EMAIL || "hello@rushgraphics.com",
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Subject: {
                Data: subject,
            },
            Body: {
                Html: {
                    Data: html,
                },
            },
        },
    });

    try {
        const result = await ses.send(command);
        console.log("Email sent successfully:", result.MessageId);
        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
}
