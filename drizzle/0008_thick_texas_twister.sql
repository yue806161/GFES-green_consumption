CREATE TABLE `local_action_registrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`consumer_id` text NOT NULL,
	`action_id` text NOT NULL,
	`status` text DEFAULT 'registered' NOT NULL,
	`registered_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_local_action_registration_once` ON `local_action_registrations` (`consumer_id`,`action_id`);--> statement-breakpoint
ALTER TABLE `local_actions` ADD `address` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `local_actions` ADD `details` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `merchant_offers` ADD `address` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `merchant_offers` ADD `details` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `recipient_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `recipient_phone` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `postal_code` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `shipping_address` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `delivery_note` text DEFAULT '' NOT NULL;