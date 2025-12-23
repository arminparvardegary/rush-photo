import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize SES client
const sesClient = new SESClient({
    region: process.env.AWS_REGION || "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export async function sendEmail({
    to,
    subject,
    html,
    text,
}: {
    to: string;
    subject: string;
    html: string;
    text: string;
}): Promise<string | null> {
    try {
        const command = new SendEmailCommand({
            Source: `Rush Photo <${process.env.AWS_SES_FROM_EMAIL || "hello@rush.video"}>`,
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Subject: {
                    Data: subject,
                    Charset: "UTF-8",
                },
                Body: {
                    Html: {
                        Data: html,
                        Charset: "UTF-8",
                    },
                    Text: {
                        Data: text,
                        Charset: "UTF-8",
                    },
                },
            },
        });

        const response = await sesClient.send(command);
        return response.MessageId || null;
    } catch (error) {
        console.error("Error sending email via SES:", error);
        return null;
    }
}
