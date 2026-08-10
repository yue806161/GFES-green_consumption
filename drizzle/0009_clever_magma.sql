CREATE TABLE `resource_redemptions` (
	`id` text PRIMARY KEY NOT NULL,
	`farmer_id` text NOT NULL,
	`offer_id` text NOT NULL,
	`resource_name` text NOT NULL,
	`points` integer NOT NULL,
	`cooperative` text NOT NULL,
	`contact_name` text NOT NULL,
	`contact_phone` text NOT NULL,
	`fulfillment_type` text NOT NULL,
	`delivery_address` text DEFAULT '' NOT NULL,
	`appointment_date` text DEFAULT '' NOT NULL,
	`appointment_slot` text DEFAULT '' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`stage` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`tracking_number` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_resource_redemptions_farmer_created` ON `resource_redemptions` (`farmer_id`,`created_at`);