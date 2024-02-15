import React from "react";
import { render } from "@react-email/render";

function renderEmail(reactEmail: React.ReactElement): {
    html: string;
    text: string;
} {
    return {
        html: render(reactEmail, { pretty: true }),
        text: render(reactEmail, { plainText: true }),
    };
}

export { renderEmail };
