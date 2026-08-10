CREATE TABLE `consumer_settings` (
	`consumer_id` text PRIMARY KEY NOT NULL,
	`contact_email` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`delivery_recipient_name` text DEFAULT '' NOT NULL,
	`delivery_phone` text DEFAULT '' NOT NULL,
	`delivery_postal_code` text DEFAULT '' NOT NULL,
	`delivery_city` text DEFAULT '' NOT NULL,
	`delivery_district` text DEFAULT '' NOT NULL,
	`delivery_address` text DEFAULT '' NOT NULL,
	`delivery_note` text DEFAULT '' NOT NULL,
	`residence_postal_code` text DEFAULT '' NOT NULL,
	`residence_city` text DEFAULT '' NOT NULL,
	`residence_district` text DEFAULT '' NOT NULL,
	`residence_address` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
