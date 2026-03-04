PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transacoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`valor` integer NOT NULL,
	`tipo` text NOT NULL,
	`usuario_id` integer NOT NULL,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_transacoes`("id", "titulo", "valor", "tipo", "usuario_id") SELECT "id", "titulo", "valor", "tipo", "usuario_id" FROM `transacoes`;--> statement-breakpoint
DROP TABLE `transacoes`;--> statement-breakpoint
ALTER TABLE `__new_transacoes` RENAME TO `transacoes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;