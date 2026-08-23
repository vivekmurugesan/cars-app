-- Fix user_interests column type
-- Change from user_interest ENUM to VARCHAR to accept string values

-- Drop the ENUM type constraint by changing column type
ALTER TABLE user_interests
ALTER COLUMN interest TYPE VARCHAR(255);

-- Drop the ENUM type if it's no longer used
DROP TYPE IF EXISTS user_interest CASCADE;
