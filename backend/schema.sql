CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, 
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    certificate_received INTEGER DEFAULT 0
);
