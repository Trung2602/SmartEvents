CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE account (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    role VARCHAR(10) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    CONSTRAINT check_role CHECK (role IN ('ADMIN', 'USER'))
);

CREATE TABLE admin (
    account_uuid UUID PRIMARY KEY,
    department VARCHAR(100),
    permissions TEXT,
    CONSTRAINT fk_admin_account FOREIGN KEY (account_uuid) REFERENCES account(uuid) ON DELETE CASCADE
);

CREATE TABLE users (
    account_uuid UUID PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    city VARCHAR(100),
    country_code VARCHAR(10),
    interests TEXT,
    sentiment_score DECIMAL(4,3) DEFAULT 0.000,
    preferences TEXT,
    CONSTRAINT fk_users_account FOREIGN KEY (account_uuid) REFERENCES account(uuid) ON DELETE CASCADE,
    CONSTRAINT check_sentiment CHECK (sentiment_score >= -1.000 AND sentiment_score <= 1.000),
    CONSTRAINT check_birth_date CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE)
);

CREATE TABLE channel (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    channel_type VARCHAR(20) DEFAULT 'PERSONAL',
    avatar_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    is_public BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    follower_count INTEGER DEFAULT 0,
    event_count INTEGER DEFAULT 0,
    owner_uuid UUID NOT NULL,
    status VARCHAR(15) DEFAULT 'ACTIVE',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_channel_type CHECK (channel_type IN ('PERSONAL', 'ORGANIZATION', 'BUSINESS', 'COMMUNITY')),
    CONSTRAINT check_status CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DELETED')),
    CONSTRAINT check_follower_count CHECK (follower_count >= 0),
    CONSTRAINT check_event_count CHECK (event_count >= 0),
    CONSTRAINT fk_channel_owner FOREIGN KEY (owner_uuid) REFERENCES account(uuid)
);

CREATE TABLE channel_member (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_uuid UUID NOT NULL,
    users_uuid UUID NOT NULL,
    role VARCHAR(15) DEFAULT 'MEMBER',
    permissions TEXT,
    invitation_status VARCHAR(15) DEFAULT 'PENDING',
    invited_by UUID,
    joined_at TIMESTAMP,
    CONSTRAINT check_member_role CHECK (role IN ('OWNER', 'ADMIN', 'MODERATOR', 'EDITOR', 'MEMBER')),
    CONSTRAINT check_invitation_status CHECK (invitation_status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'REMOVED')),
    CONSTRAINT unique_channel_member UNIQUE(channel_uuid, users_uuid),
    CONSTRAINT fk_member_channel FOREIGN KEY (channel_uuid) REFERENCES channel(uuid) ON DELETE CASCADE,
    CONSTRAINT fk_member_users FOREIGN KEY (users_uuid) REFERENCES account(uuid) ON DELETE CASCADE,
    CONSTRAINT fk_invited_by FOREIGN KEY (invited_by) REFERENCES account(uuid)
);

CREATE TABLE channel_follower (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_uuid UUID NOT NULL,
    follower_uuid UUID NOT NULL,
    notification_enabled BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_channel_follower UNIQUE(channel_uuid, follower_uuid),
    CONSTRAINT fk_follower_channel FOREIGN KEY (channel_uuid) REFERENCES channel(uuid) ON DELETE CASCADE,
    CONSTRAINT fk_follower_users FOREIGN KEY (follower_uuid) REFERENCES account(uuid) ON DELETE CASCADE
);

CREATE TABLE event (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_uuid UUID,
    current_version_uuid UUID NOT NULL,
    original_uuid UUID NOT NULL,
    status VARCHAR(10) DEFAULT 'PENDING',
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    created_by UUID NOT NULL,
    accepted_by UUID,
    edit_count INTEGER DEFAULT 0,
    CONSTRAINT check_status CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    CONSTRAINT check_participants CHECK (max_participants IS NULL OR (max_participants > 0 AND current_participants <= max_participants)),
    CONSTRAINT fk_event_channel FOREIGN KEY (channel_uuid) REFERENCES channel(uuid),
    CONSTRAINT fk_event_creator FOREIGN KEY (created_by) REFERENCES account(uuid),
    CONSTRAINT fk_event_acceptor FOREIGN KEY (accepted_by) REFERENCES admin(account_uuid)
);

CREATE TABLE event_content (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_uuid UUID NOT NULL,
    previous_version_uuid UUID,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT,
    country_code VARCHAR(10) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    image_url VARCHAR(500),
    host_uuids UUID[],
    edited_by UUID NOT NULL,
    edit_reason VARCHAR(500),
    is_current_version BOOLEAN DEFAULT TRUE,
    CONSTRAINT check_time_range CHECK (end_time > start_time),
    CONSTRAINT fk_content_event FOREIGN KEY (event_uuid) REFERENCES event(uuid) ON DELETE CASCADE,
    CONSTRAINT fk_content_editor FOREIGN KEY (edited_by) REFERENCES account(uuid),
    CONSTRAINT fk_previous_version FOREIGN KEY (previous_version_uuid) REFERENCES event_content(uuid)
);

CREATE TABLE event_registration (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_uuid UUID NOT NULL,
    users_uuid UUID NOT NULL,
    registration_status VARCHAR(15) DEFAULT 'REGISTERED',
    registration_notes TEXT,
    check_in_status VARCHAR(15) DEFAULT 'NOT_CHECKED_IN',
    check_in_time TIMESTAMP,
    cancellation_reason VARCHAR(500),
    is_waitlist BOOLEAN DEFAULT FALSE,
    waitlist_position INTEGER,
    CONSTRAINT check_registration_status CHECK (registration_status IN ('REGISTERED', 'CANCELLED', 'NO_SHOW', 'ATTENDED')),
    CONSTRAINT check_checkin_status CHECK (check_in_status IN ('NOT_CHECKED_IN', 'CHECKED_IN', 'CHECKED_OUT')),
    CONSTRAINT check_waitlist_position CHECK (waitlist_position IS NULL OR waitlist_position > 0),
    CONSTRAINT unique_registration UNIQUE(event_uuid, users_uuid),
    CONSTRAINT fk_registration_event FOREIGN KEY (event_uuid) REFERENCES event(uuid) ON DELETE CASCADE,
    CONSTRAINT fk_registration_users FOREIGN KEY (users_uuid) REFERENCES users(account_uuid) ON DELETE CASCADE
);

CREATE TABLE event_feedback (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_uuid UUID NOT NULL,
    users_uuid UUID NOT NULL,
    rating SMALLINT NOT NULL,
    comment TEXT,
    sentiment VARCHAR(10),
    sentiment_confidence DECIMAL(4,3),
    CONSTRAINT check_rating CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT check_sentiment_type CHECK (sentiment IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE')),
    CONSTRAINT check_confidence CHECK (sentiment_confidence IS NULL OR (sentiment_confidence >= 0.000 AND sentiment_confidence <= 1.000)),
    CONSTRAINT unique_feedback UNIQUE(event_uuid, users_uuid),
    CONSTRAINT fk_feedback_event FOREIGN KEY (event_uuid) REFERENCES event(uuid) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_users FOREIGN KEY (users_uuid) REFERENCES users(account_uuid) ON DELETE CASCADE
);

CREATE TABLE chat_history (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    users_uuid UUID NOT NULL,
    session_id UUID DEFAULT uuid_generate_v4(),
    message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context_used TEXT,
    model_used VARCHAR(100),
    response_time_ms INTEGER,
    CONSTRAINT check_response_time CHECK (response_time_ms IS NULL OR response_time_ms > 0),
    CONSTRAINT fk_chat_users FOREIGN KEY (users_uuid) REFERENCES users(account_uuid) ON DELETE CASCADE
);

CREATE TABLE recommendation (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    users_uuid UUID NOT NULL,
    event_uuid UUID NOT NULL,
    model_used VARCHAR(100) NOT NULL,
    confidence_score DECIMAL(4,3) NOT NULL,
    reasoning TEXT,
    is_clicked BOOLEAN DEFAULT FALSE,
    is_registered BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP,
    CONSTRAINT check_confidence_score CHECK (confidence_score >= 0.000 AND confidence_score <= 1.000),
    CONSTRAINT unique_recommendation UNIQUE(users_uuid, event_uuid),
    CONSTRAINT fk_rec_users FOREIGN KEY (users_uuid) REFERENCES users(account_uuid) ON DELETE CASCADE,
    CONSTRAINT fk_rec_event FOREIGN KEY (event_uuid) REFERENCES event(uuid) ON DELETE CASCADE
);

CREATE TABLE event_embedding (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_uuid UUID NOT NULL,
    embedding_vector TEXT,
    source_text TEXT NOT NULL,
    model_used VARCHAR(100) NOT NULL,
    dimension INTEGER NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dimension CHECK (dimension > 0),
    CONSTRAINT unique_embedding UNIQUE(event_uuid),
    CONSTRAINT fk_embedding_event FOREIGN KEY (event_uuid) REFERENCES event(uuid) ON DELETE CASCADE
);

CREATE TABLE image_analysis (
    uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_uuid UUID NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    s3_bucket VARCHAR(100) NOT NULL,
    detected_labels TEXT NOT NULL,
    confidence_score DECIMAL(4,3) NOT NULL,
    image_size_bytes BIGINT,
    image_dimensions TEXT,
    CONSTRAINT check_image_confidence CHECK (confidence_score >= 0.000 AND confidence_score <= 1.000),
    CONSTRAINT check_image_size CHECK (image_size_bytes IS NULL OR image_size_bytes > 0),
    CONSTRAINT fk_analysis_event FOREIGN KEY (event_uuid) REFERENCES event(uuid) ON DELETE CASCADE
);

-- Point-in-Time Recovery cho mỗi database
-- RDS Automated Backups: 7 days retention
-- Manual Snapshots: Daily, retained 30 days

-- Cross-region replication cho Payment DB (critical)
CREATE SUBSCRIPTION payment_db_replica
CONNECTION 'host=payment-db-primary.region-2.rds.amazonaws.com'
PUBLICATION payment_transactions;

-- Data retention policies
CREATE TABLE event_history (
    LIKE event INCLUDING ALL
) INHERITS (event);

-- Move old events > 1 year sang history table
CREATE OR REPLACE FUNCTION archive_old_events()
RETURNS void AS $$
BEGIN
    INSERT INTO event_history
    SELECT * FROM event WHERE created_at < NOW() - INTERVAL '1 year';
    
    DELETE FROM event WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;