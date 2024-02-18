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

CREATE OR REPLACE FUNCTION find_user_by_email(_email TEXT)
RETURNS TABLE(user_id UUID, username TEXT, email TEXT, email_verified BOOLEAN, password_hash TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id, u.username, u.email, u.email_verified, u.password_hash
    FROM users AS u
    WHERE u.email = _email;
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

CREATE OR REPLACE FUNCTION create_password_reset(
    _user_id UUID,
    _token_hash TEXT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    _password_reset_id UUID;
BEGIN
    -- Insert the new password reset record into the password_resets table
    INSERT INTO password_resets (user_id, token_hash)
    VALUES (_user_id, _token_hash)
    RETURNING password_reset_id INTO _password_reset_id;

    -- Return the UUID of the newly created password reset record
    RETURN _password_reset_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_password_reset(_password_reset_id UUID)
RETURNS TABLE(
    password_reset_id UUID,
    user_id UUID,
    token_hash TEXT,
    utilized BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.password_reset_id, p.user_id, p.token_hash, p.utilized, p.created_at, p.expires_at
    FROM password_resets p
    WHERE p.password_reset_id = _password_reset_id;
END;
$$;

CREATE OR REPLACE FUNCTION reset_password(_password_reset_id UUID, _password_hash TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the password reset entry exists, is still valid (not expired), and has not been utilized
    IF NOT EXISTS (
        SELECT 1
        FROM password_resets
        WHERE password_reset_id = _password_reset_id
        AND expires_at > CURRENT_TIMESTAMP
        AND utilized = FALSE
    ) THEN
        RAISE EXCEPTION 'Password reset ID does not exist, the password reset has expired, or it has already been utilized.';
    ELSE
        -- Update the users table to set the new password_hash for the user associated with this password reset
        UPDATE users
        SET password_hash = _password_hash
        WHERE user_id = (
            SELECT user_id FROM password_resets WHERE password_reset_id = _password_reset_id
        );

        -- Update the password_resets table to set utilized = TRUE for the password reset
        UPDATE password_resets
        SET utilized = TRUE
        WHERE password_reset_id = _password_reset_id;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION create_session(
    _user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    _session_id UUID;
BEGIN
    INSERT INTO sessions (user_id)
    VALUES (_user_id)
    RETURNING session_id INTO _session_id;

    RETURN _session_id;
END;
$$;

CREATE OR REPLACE FUNCTION find_session_by_id(_session_id UUID)
RETURNS TABLE(session_id UUID, user_id UUID, created_at TIMESTAMP WITH TIME ZONE, expires_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT s.session_id, s.user_id, s.created_at, s.expires_at
    FROM sessions AS s
    WHERE s.session_id = _session_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_session_by_id(_session_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM sessions
    WHERE session_id = _session_id;
END;
$$;
