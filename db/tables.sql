CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    userId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    salt TEXT NOT NULL,
    password TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE auth_challenges (
    challengeId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL,
    expected TEXT NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE SET NULL
);
