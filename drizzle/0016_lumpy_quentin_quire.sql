CREATE UNIQUE INDEX `idx_account_controls_email_unique_schema` ON `account_controls` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_account_controls_provider_unique_schema` ON `account_controls` (`auth_provider`,`provider_subject`);--> statement-breakpoint
CREATE INDEX `idx_oauth_states_expiry_schema` ON `oauth_states` (`expires_at`);