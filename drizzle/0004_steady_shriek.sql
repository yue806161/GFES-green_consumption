CREATE TABLE `data_templates` (
	`template_key` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`target_role` text NOT NULL,
	`upload_area` text NOT NULL,
	`document_type` text NOT NULL,
	`file_name` text NOT NULL,
	`schema_version` text DEFAULT '1.0' NOT NULL,
	`description` text NOT NULL,
	`sample_data_json` text DEFAULT '{}' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
