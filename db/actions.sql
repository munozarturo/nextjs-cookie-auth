CREATE OR REPLACE FUNCTION create_user(
    _email VARCHAR(255),
    _password VARCHAR(64)
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    new_user_id UUID;
BEGIN
    INSERT INTO users (email, password)
    VALUES (_email, _password)
    RETURNING userId INTO new_user_id;
    
    RETURN new_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION check_user_exists_by_username(
    _username VARCHAR(255)
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
    _email VARCHAR(255)
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
