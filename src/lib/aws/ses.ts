import { SESClient } from "@aws-sdk/client-ses";

function createSESClient(): SESClient {
    const awsRegion = process.env.AWS_REGION;
    if (!awsRegion) {
        throw new Error("Environment variable `AWS_REGION` undefined.");
    }

    const sesClient = new SESClient({
        region: awsRegion,
    });

    return sesClient;
}

export { createSESClient };
