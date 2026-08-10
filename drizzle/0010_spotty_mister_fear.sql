CREATE TABLE `auth_login_attempts` (
	`attempt_key` text PRIMARY KEY NOT NULL,
	`failures` integer DEFAULT 0 NOT NULL,
	`window_started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`blocked_until` text
);
--> statement-breakpoint
CREATE TABLE `auth_sessions` (
	`token` text PRIMARY KEY NOT NULL,
	`csrf_token` text NOT NULL,
	`profile_id` text NOT NULL,
	`role` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `action_submissions` ADD `file_sha256` text;--> statement-breakpoint
ALTER TABLE `verification_runs` ADD `input_fingerprint` text;
--> statement-breakpoint
CREATE INDEX `idx_auth_sessions_expiry` ON `auth_sessions` (`expires_at`);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_verification_once` ON `verification_runs` (`service_key`,`input_fingerprint`) WHERE `input_fingerprint` IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_action_submission_file_once` ON `action_submissions` (`consumer_id`,`action_type`,`file_sha256`) WHERE `file_sha256` IS NOT NULL;
--> statement-breakpoint
CREATE TRIGGER `trg_point_ledger_integer_guard`
BEFORE INSERT ON `point_ledger`
WHEN typeof(NEW.delta_points) != 'integer' OR NEW.delta_points = 0 OR ABS(NEW.delta_points) > 1000000
BEGIN SELECT RAISE(ABORT, '綠點異動必須是 1 至 1,000,000 的整數'); END;
--> statement-breakpoint
CREATE TRIGGER `trg_point_ledger_nonnegative_balance`
BEFORE INSERT ON `point_ledger`
WHEN NEW.delta_points < 0 AND COALESCE((SELECT SUM(delta_points) FROM point_ledger WHERE user_id = NEW.user_id), 0) + NEW.delta_points < 0
BEGIN SELECT RAISE(ABORT, '綠點餘額不足，交易已拒絕'); END;
--> statement-breakpoint
CREATE TRIGGER `trg_products_nonnegative_stock_insert`
BEFORE INSERT ON `products`
WHEN typeof(NEW.stock) != 'integer' OR NEW.stock < 0
BEGIN SELECT RAISE(ABORT, '商品庫存不可為負數或小數'); END;
--> statement-breakpoint
CREATE TRIGGER `trg_products_nonnegative_stock_update`
BEFORE UPDATE OF `stock` ON `products`
WHEN typeof(NEW.stock) != 'integer' OR NEW.stock < 0
BEGIN SELECT RAISE(ABORT, '商品庫存不足，交易已拒絕'); END;
