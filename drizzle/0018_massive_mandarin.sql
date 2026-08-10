ALTER TABLE `account_controls` ADD `username` text;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_account_controls_username_unique_schema` ON `account_controls` (`username`);