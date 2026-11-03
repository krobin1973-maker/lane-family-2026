CREATE TABLE `food_signups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`dish` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL DEFAULT 'Other',
	`serves` varchar(50) NOT NULL DEFAULT '',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `food_signups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rsvps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`guests_thursday` int NOT NULL DEFAULT 0,
	`guests_friday` int NOT NULL DEFAULT 0,
	`guests_saturday` int NOT NULL DEFAULT 0,
	`guests_sunday` int NOT NULL DEFAULT 0,
	`notes` text,
	`dietary_restrictions` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `rsvps_id` PRIMARY KEY(`id`)
);
