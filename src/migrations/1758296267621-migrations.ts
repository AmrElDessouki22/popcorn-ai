import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1758296267621 implements MigrationInterface {
    name = 'Migrations1758296267621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_e40a1dd2909378f0da1f34f7bd6\``);
        await queryRunner.query(`CREATE TABLE \`messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`content\` text NOT NULL, \`type\` varchar(255) NOT NULL DEFAULT 'text', \`senderType\` varchar(255) NOT NULL DEFAULT 'user', \`fileUrl\` varchar(255) NULL, \`fileName\` varchar(255) NULL, \`isEdited\` tinyint NOT NULL DEFAULT 0, \`editedAt\` datetime NULL, \`aiModel\` varchar(255) NULL, \`userId\` int NULL, \`senderName\` varchar(255) NULL, \`senderAvatar\` varchar(255) NULL, \`richContent\` json NULL, \`templateType\` varchar(255) NULL, \`metadata\` varchar(255) NULL, \`conversationId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`conversations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(255) NULL, \`type\` varchar(255) NOT NULL DEFAULT 'assistant', \`isActive\` tinyint NOT NULL DEFAULT 1, \`lastMessageAt\` datetime NULL, \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`height\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`length\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`sellerId\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`width\``);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_4838cd4fc48a6ff2d4aa01aa646\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_e5663ce0c730b2de83445e2fd19\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversations\` ADD CONSTRAINT \`FK_a9b3b5d51da1c75242055338b59\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversations\` DROP FOREIGN KEY \`FK_a9b3b5d51da1c75242055338b59\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_e5663ce0c730b2de83445e2fd19\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_4838cd4fc48a6ff2d4aa01aa646\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`width\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`sellerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`length\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`height\` int NULL`);
        await queryRunner.query(`DROP TABLE \`conversations\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_e40a1dd2909378f0da1f34f7bd6\` FOREIGN KEY (\`sellerId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
