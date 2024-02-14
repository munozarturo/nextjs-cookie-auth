import { SendEmailCommand } from "@aws-sdk/client-ses";
import { createSESClient } from "@/app/lib/aws/ses";

interface Email {
    sender: string;
    recipient: string | string[];
    subject: string;
    textBody?: string;
    htmlBody?: string;
}

async function sendEmail(email: Email) {
    const sesClient = createSESClient();

    const sendEmailCommand = new SendEmailCommand({
        Destination: {
            ToAddresses:
                typeof email.recipient === "string"
                    ? [email.recipient]
                    : email.recipient,
        },
        Message: {
            Body: {
                Text: {
                    Data: email.textBody,
                    Charset: "UTF-8",
                },
                Html: {
                    Data: email.htmlBody,
                    Charset: "UTF-8",
                },
            },
            Subject: {
                Data: email.subject,
                Charset: "UTF-8",
            },
        },
        Source: email.sender,
    });

    sesClient
        .send(sendEmailCommand)
        .then((data) => {
            // success
        })
        .catch((error) => {
            // error
        });
}

export { sendEmail, type Email };
