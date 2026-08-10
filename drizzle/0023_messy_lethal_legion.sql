ALTER TABLE `outcome_reports` ADD `institution_id` text DEFAULT 'institution-001' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_outcome_reports_institution_submitted` ON `outcome_reports` (`institution_id`,`submitted_at`);--> statement-breakpoint
ALTER TABLE `resource_offers` ADD `institution_id` text DEFAULT 'institution-001' NOT NULL;--> statement-breakpoint
ALTER TABLE `resource_redemptions` ADD `institution_id` text DEFAULT 'institution-001' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_resource_redemptions_institution_created` ON `resource_redemptions` (`institution_id`,`created_at`);