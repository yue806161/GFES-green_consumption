CREATE TABLE `farmer_news` (
	`id` text PRIMARY KEY NOT NULL,
	`farmer_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`category` text DEFAULT '農場近況' NOT NULL,
	`image_key` text,
	`image_url` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`published_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_farmer_news_farmer_status_created` ON `farmer_news` (`farmer_id`,`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_farmer_news_status_published` ON `farmer_news` (`status`,`published_at`);--> statement-breakpoint
CREATE TABLE `farmer_stories` (
	`farmer_id` text PRIMARY KEY NOT NULL,
	`headline` text NOT NULL,
	`summary` text NOT NULL,
	`body` text NOT NULL,
	`quote` text DEFAULT '' NOT NULL,
	`image_key` text,
	`image_url` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`published_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_farmer_stories_status_published` ON `farmer_stories` (`status`,`published_at`);