CREATE TABLE `change_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`request_type` text NOT NULL,
	`target_id` text NOT NULL,
	`requester_id` text NOT NULL,
	`reason_code` text NOT NULL,
	`reason_detail` text DEFAULT '' NOT NULL,
	`requested_json` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`reviewer_id` text DEFAULT '' NOT NULL,
	`review_note` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_change_requests_target_created` ON `change_requests` (`request_type`,`target_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_change_requests_status_created` ON `change_requests` (`status`,`created_at`);