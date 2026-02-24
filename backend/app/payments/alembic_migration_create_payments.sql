-- Alembic migration: create payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth_user(id),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'KES',
    method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    provider_ref VARCHAR(128),
    purpose VARCHAR(64) NOT NULL,
    phone VARCHAR(32),
    raw_payload TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);
