ALTER TABLE `oauth_states` ADD `attempt_key` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_oauth_states_attempt_created_schema` ON `oauth_states` (`attempt_key`,`created_at`);