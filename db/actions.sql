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

CREATE OR REPLACE FUNCTION get_user_by_id(_userId UUID)
RETURNS TABLE(userId UUID, username TEXT, email TEXT, verified BOOLEAN)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT u.userId, u.username, u.email, u.verified
    FROM users AS u
    WHERE u.userId = _userId;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_by_id(_userId text)
RETURNS TABLE(userId UUID, username TEXT, email TEXT, verified BOOLEAN)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT userId, username, email, verified
    FROM users
    WHERE userId = _userId::UUID; -- Explicit cast to UUID
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
