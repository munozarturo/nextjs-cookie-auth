class APIError extends Error {
    public readonly status: number;

    constructor(message: string, status: number) {
        super(message);

        this.status = status;

        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class RequestBodyError extends APIError {}

class BodyParsingError extends APIError {}

class ContextParsingError extends APIError {}

class VerificationError extends APIError {}

class AuthError extends APIError {}

class DatabaseError extends APIError {}

class DatabaseConnectionError extends DatabaseError {}

class NotificationError extends APIError {}

class EmailNotificationError extends NotificationError {}

export {
    APIError,
    RequestBodyError,
    BodyParsingError,
    ContextParsingError,
    VerificationError,
    AuthError,
    DatabaseError,
    DatabaseConnectionError,
    NotificationError,
    EmailNotificationError,
};
