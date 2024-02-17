import { SendEmailCommand } from "@aws-sdk/client-ses";
import { createSESClient } from "@/app/lib/aws/ses";
import { EmailNotificationError } from "../errors";

interface Email {
    sender: string;
    recipient: string | string[];
    subject: string;
    textBody?: string;
    htmlBody?: string;
}

async function sendEmail(email: Email) {
    const sesClient = createSESClient();

    let Body: {
        Text?: { Data: string; Charset: string };
        Html?: { Data: string; Charset: string };
    } = {};

    if (email.textBody) {
        Body.Text = {
            Data: email.textBody,
            Charset: "UTF-8",
        };
    }

    if (email.htmlBody) {
        Body.Html = {
            Data: email.htmlBody,
            Charset: "UTF-8",
        };
    }

    const sendEmailCommand = new SendEmailCommand({
        Destination: {
            ToAddresses:
                typeof email.recipient === "string"
                    ? [email.recipient]
                    : email.recipient,
        },
        Message: {
            Body: Body,
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
            // on success
        })
        .catch((error) => {
            console.log(error);
            throw new EmailNotificationError("Failed to send email.", 500);
        });
}

export { sendEmail, type Email };
