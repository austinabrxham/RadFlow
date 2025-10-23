-- WARNING: This script will DELETE/TRUNCATE data in the database and DROP the qr_code column if present.
-- Do NOT run this unless you have a backup or you explicitly intend to wipe all data.
-- Recommended: Review and run the statements one-by-one in your MySQL client.

-- 1) Optionally view whether qr_code column exists:
SELECT COUNT(*) AS col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'patients'
  AND COLUMN_NAME = 'qr_code';

-- 2) Disable foreign key checks to allow truncation
SET FOREIGN_KEY_CHECKS = 0;

-- 3) Truncate tables (destructive)
TRUNCATE TABLE patient_stages;
TRUNCATE TABLE patients;
TRUNCATE TABLE users;

-- 4) Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- 5) Drop the qr_code column from patients if it still exists.
-- Note: If you ran a recent schema migration that already removed the column, this will fail.
-- Run the SELECT above first to verify. If the column exists, run:

-- ALTER TABLE patients DROP COLUMN qr_code;

-- End of script
