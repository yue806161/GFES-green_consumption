CREATE TABLE `action_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`consumer_id` text NOT NULL,
	`action_type` text NOT NULL,
	`title` text NOT NULL,
	`note` text NOT NULL,
	`reward_points` integer NOT NULL,
	`file_key` text NOT NULL,
	`file_name` text NOT NULL,
	`content_type` text NOT NULL,
	`file_size` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`review_note` text,
	`submitted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`reviewed_at` text
);
