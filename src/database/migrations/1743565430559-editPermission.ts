import { MigrationInterface, QueryRunner } from "typeorm";

export class EditPermission1743565430559 implements MigrationInterface {
    name = 'EditPermission1743565430559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "urlPath"`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "path" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permission" ADD CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "permission" ALTER COLUMN "name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "action"`);
        await queryRunner.query(`DROP TYPE "public"."permission_action_enum"`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "action" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "action"`);
        await queryRunner.query(`CREATE TYPE "public"."permission_action_enum" AS ENUM('add', 'view', 'delete', 'edit')`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "action" "public"."permission_action_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permission" ALTER COLUMN "name" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "permission" DROP CONSTRAINT "UQ_240853a0c3353c25fb12434ad33"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "path"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "urlPath" character varying NOT NULL`);
    }

}
