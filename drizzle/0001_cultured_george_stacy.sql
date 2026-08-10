CREATE TABLE `procurement_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`quantity` integer NOT NULL,
	`budget_points` integer NOT NULL,
	`delivery_region` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
