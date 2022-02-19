CREATE TABLE IF NOT EXISTS agents
(
    agent_id   BIGSERIAL PRIMARY KEY,
    password   VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name  VARCHAR NOT NULL,
    email      VARCHAR NOT NULL,
    phone      VARCHAR,
    address    VARCHAR NOT NULL,

    UNIQUE(email, password)
);

CREATE TABLE IF NOT EXISTS estates(
    estate_id BIGSERIAL,
    agent_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    property_type TEXT NOT NULL,
    address TEXT NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    garages INTEGER NOT NULL,
    land_sqm INTEGER NOT NULL,
    price INTEGER NOT NUll,
    images TEXT,
    "open" BOOLEAN NOT NULL,
    viewed INTEGER NOT NULL,

    PRIMARY KEY(estate_id),
    FOREIGN KEY(agent_id) REFERENCES agents(agent_id)
);

CREATE TABLE IF NOT EXISTS inspections(
    inspection_id BIGSERIAL,
    estate_id BIGINT NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,

    FOREIGN KEY(estate_id) REFERENCES estates(estate_id)
);

CREATE TABLE IF NOT EXISTS inspectors
(
    inspector_id BIGSERIAL PRIMARY KEY,
    password VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name  VARCHAR NOT NULL,
    email      VARCHAR NOT NULL,
    phone      VARCHAR,

    UNIQUE(email, password)
);

CREATE TABLE IF NOT EXISTS history
(
    history_id BIGSERIAL,
    inspector_id BIGINT NOT NULL,
    estate_id BIGINT NOT NULL,
    view_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(inspector_id) REFERENCES inspectors(inspector_id),
    FOREIGN KEY(estate_id) REFERENCES estates(estate_id)
);

CREATE TABLE IF NOT EXISTS profiles
(
    profile_id BIGSERIAL PRIMARY KEY,
    inspector_id BIGINT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    garages INTEGER,
    property_type VARCHAR,
    land_sqm_min INTEGER,
    land_sqm_max INTEGER,
    price_min INTEGER,
    price_max INTEGER,

    FOREIGN KEY(inspector_id) REFERENCES inspectors(inspector_id)
);