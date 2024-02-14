CREATE OR REPLACE FUNCTION create_user(
    _username TEXT,
    _email TEXT,
    _password TEXT,
    _salt TEXT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    new_user_id UUID;
BEGIN
    INSERT INTO users (username, email, salt, password)
    VALUES (_username, _email, _salt, _password)
    RETURNING userId INTO new_user_id;
    
    RETURN new_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION find_user_by_id(_userid UUID)
RETURNS TABLE(userid UUID, username TEXT, email TEXT, verified BOOLEAN)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT u.userId, u.username, u.email, u.verified
    FROM users AS u
    WHERE u.userId = _userid;
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

CREATE OR REPLACE FUNCTION create_auth_challenge(
    _userid UUID,
    _salt TEXT,
    _expected TEXT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    _challengeId UUID;
BEGIN
    INSERT INTO auth_challenges (userId, salt, expected)
    VALUES (_userid, _salt, _expected)
    RETURNING challengeId INTO _challengeId;
    
    RETURN _challengeId;
END;
$$;

CREATE OR REPLACE FUNCTION get_auth_challenge(_challengeid UUID)
RETURNS TABLE(
    challengeId UUID,
    userId UUID,
    expected TEXT,
    passed BOOLEAN,
    created_at TIMESTAMP WITHOUT TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT challengeId, userId, expected, passed, created_at
    FROM auth_challenges
    WHERE challengeId = _challengeid;
END;
$$;

CREATE OR REPLACE FUNCTION pass_auth_challenge(_challengeid UUID, _expected TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if the challengeId exists and the expected value matches
    IF NOT EXISTS (
        SELECT 1
        FROM auth_challenges
        WHERE challengeId = _challengeid
    ) THEN
        RAISE EXCEPTION 'Challenge ID does not exist.';
    ELSIF NOT EXISTS (
        SELECT 1
        FROM auth_challenges
        WHERE challengeId = _challengeid AND expected = _expected
    ) THEN
        RAISE EXCEPTION 'Expected value does not match.';
    ELSE
        -- Update the auth_challenges table to set passed = TRUE for the challenge
        UPDATE auth_challenges
        SET passed = TRUE
        WHERE challengeId = _challengeid;

        -- Then, update the users table to set verified = TRUE for the associated userId
        UPDATE users
        SET verified = TRUE
        WHERE userId = (
            SELECT userId FROM auth_challenges WHERE challengeId = _challengeid
        );
    END IF;
END;
$$;
