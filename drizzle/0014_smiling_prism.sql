ALTER TABLE `orders` ADD `carrier` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `tracking_number` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `fulfillment_note` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `packed_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `shipped_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `completed_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL;