CREATE TABLE `integration_settings` (
	`service_key` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`mode` text DEFAULT 'simulation' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`reward_points` integer DEFAULT 0 NOT NULL,
	`endpoint_label` text NOT NULL,
	`sample_response_json` text DEFAULT '{}' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verification_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`service_key` text NOT NULL,
	`input_json` text DEFAULT '{}' NOT NULL,
	`response_json` text DEFAULT '{}' NOT NULL,
	`status` text NOT NULL,
	`reward_points` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
