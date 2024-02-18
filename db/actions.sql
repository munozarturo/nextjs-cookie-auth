CREATE OR REPLACE FUNCTION create_user(
    _username TEXT,
    _email TEXT,
    _password_hash TEXT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    _user_id UUID;
BEGIN
    -- Insert the new user into the users table and return the new user_id
    INSERT INTO users (username, email, password_hash)
    VALUES (_username, _email, _password_hash)
    RETURNING user_id INTO _user_id;

    -- Return the UUID of the newly created user
    RETURN _user_id;
END;
$$;

CREATE OR REPLACE FUNCTION find_user_by_id(_user_id UUID)
RETURNS TABLE(user_id UUID, username TEXT, email TEXT, email_verified BOOLEAN)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id, u.username, u.email, u.email_verified
    FROM users AS u
    WHERE u.user_id = _user_id;
END;
$$;

CREATE OR REPLACE FUNCTION check_user_exists_by_username(
    _username TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM users
        WHERE username = _username
    );
END;
$$;

CREATE OR REPLACE FUNCTION check_user_exists_by_email(
    _email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM users
        WHERE email = _email
    );
END;
$$;

CREATE OR REPLACE FUNCTION create_email_verification(
    _user_id UUID,
    _token_hash TEXT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    _verification_id UUID;
BEGIN
    -- Insert the new email verification record into the email_verifications table
    INSERT INTO email_verifications (user_id, token_hash)
    VALUES (_user_id, _token_hash)
    RETURNING verification_id INTO _verification_id;

    -- Return the UUID of the newly created email verification record
    RETURN _verification_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_email_verification(_verification_id UUID)
RETURNS TABLE(
    verification_id UUID,
    user_id UUID,
    token_hash TEXT,
    verified BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT e.verification_id, e.user_id, e.token_hash, e.verified, e.created_at, e.expires_at
    FROM email_verifications e
    WHERE e.verification_id = _verification_id;
END;
$$;

CREATE OR REPLACE FUNCTION verify_email(_verification_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the verification entry exists and is still valid (not expired)
    IF NOT EXISTS (
        SELECT 1
        FROM email_verifications
        WHERE verification_id = _verification_id
        AND expires_at > CURRENT_TIMESTAMP
        AND verified = FALSE
    ) THEN
        RAISE EXCEPTION 'Verification ID does not exist, token hash does not match, or the verification has expired.';
    ELSE
        -- Update the email_verifications table to set verified = TRUE for the verification
        UPDATE email_verifications
        SET verified = TRUE
        WHERE verification_id = _verification_id;

        -- Then, update the users table to set email_verified = TRUE for the associated user_id
        UPDATE users
        SET email_verified = TRUE
        WHERE user_id = (
            SELECT user_id FROM email_verifications WHERE verification_id = _verification_id
        );
    END IF;
END;
$$;
