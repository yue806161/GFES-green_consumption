CREATE TABLE `oauth_states` (
	`state_hash` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`code_verifier` text NOT NULL,
	`redirect_uri` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `account_controls` ADD `password_hash` text;--> statement-breakpoint
ALTER TABLE `account_controls` ADD `password_salt` text;--> statement-breakpoint
ALTER TABLE `account_controls` ADD `auth_provider` text DEFAULT 'password' NOT NULL;--> statement-breakpoint
ALTER TABLE `account_controls` ADD `provider_subject` text;