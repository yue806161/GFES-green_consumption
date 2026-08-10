ALTER TABLE `local_action_registrations` ADD `attendee_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `local_action_registrations` ADD `attendee_phone` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `local_action_registrations` ADD `attendee_email` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `local_action_registrations` ADD `participant_count` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `local_action_registrations` ADD `emergency_contact_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `local_action_registrations` ADD `emergency_contact_phone` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `local_action_registrations` ADD `note` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `local_actions` ADD `event_start` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `local_actions` ADD `event_end` text DEFAULT '' NOT NULL;