CREATE TABLE `flavor_summaries` (
	`product_id` varchar(64) NOT NULL,
	`summary_en` varchar(360) NOT NULL,
	`summary_ar` varchar(360) NOT NULL,
	`source_count` int NOT NULL,
	`source_fingerprint` varchar(128) NOT NULL,
	`generated_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `flavor_summaries_product_id` PRIMARY KEY(`product_id`)
);
--> statement-breakpoint
ALTER TABLE `tasting_reflections` ADD `moderated_by` int;--> statement-breakpoint
ALTER TABLE `tasting_reflections` ADD `moderated_at` timestamp;--> statement-breakpoint
ALTER TABLE `tasting_reflections` ADD CONSTRAINT `tasting_reflections_moderated_by_users_id_fk` FOREIGN KEY (`moderated_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;