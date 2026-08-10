CREATE TABLE `evidence` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`farmer_id` text NOT NULL,
	`project_id` text,
	`product_id` text,
	`title` text NOT NULL,
	`evidence_type` text NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`submitted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`verified_at` text
);
--> statement-breakpoint
CREATE TABLE `incentive_programs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sponsor` text NOT NULL,
	`action` text NOT NULL,
	`reward` text NOT NULL,
	`budget_points` integer NOT NULL,
	`participants` text NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`esg` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `local_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`organizer` text NOT NULL,
	`description` text NOT NULL,
	`reward_points` integer NOT NULL,
	`city` text NOT NULL,
	`district` text NOT NULL,
	`distance_km` real NOT NULL,
	`status` text DEFAULT 'open' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `merchant_offers` (
	`id` text PRIMARY KEY NOT NULL,
	`merchant` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`required_points` integer NOT NULL,
	`city` text NOT NULL,
	`district` text NOT NULL,
	`distance_km` real NOT NULL,
	`status` text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`consumer_id` text NOT NULL,
	`product_id` text NOT NULL,
	`points` integer NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`stage` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'created' NOT NULL,
	`shipping_city` text NOT NULL,
	`shipping_district` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `outcome_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` text NOT NULL,
	`farmer_id` text NOT NULL,
	`water_liters` integer,
	`carbon_kg` integer,
	`beneficiaries` integer,
	`note` text NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`submitted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`verified_at` text
);
--> statement-breakpoint
CREATE TABLE `point_ledger` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`delta_points` integer NOT NULL,
	`source_type` text NOT NULL,
	`source_id` text,
	`description` text NOT NULL,
	`metadata_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`farmer_id` text NOT NULL,
	`title` text NOT NULL,
	`points` integer NOT NULL,
	`stock` integer NOT NULL,
	`unit` text NOT NULL,
	`proof` text NOT NULL,
	`delivery` text NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`city` text NOT NULL,
	`district` text NOT NULL,
	`distance_km` real NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`display_name` text NOT NULL,
	`city` text NOT NULL,
	`district` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `project_supports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`consumer_id` text NOT NULL,
	`project_id` text NOT NULL,
	`points` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`farmer_id` text NOT NULL,
	`title` text NOT NULL,
	`note` text NOT NULL,
	`purpose` text NOT NULL,
	`points` integer NOT NULL,
	`target_points` integer NOT NULL,
	`raised_points` integer DEFAULT 0 NOT NULL,
	`supporters` integer DEFAULT 0 NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`impact` text NOT NULL,
	`city` text NOT NULL,
	`district` text NOT NULL,
	`distance_km` real NOT NULL,
	`completion_date` text NOT NULL,
	`proof` text NOT NULL,
	`allocations_json` text NOT NULL,
	`story_json` text NOT NULL,
	`status` text DEFAULT 'funding' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `resource_offers` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`name` text NOT NULL,
	`required_points` integer NOT NULL,
	`term` text NOT NULL,
	`rate` text NOT NULL,
	`description` text NOT NULL,
	`purpose` text NOT NULL,
	`status` text DEFAULT 'available' NOT NULL
);
