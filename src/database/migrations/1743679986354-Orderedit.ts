import { MigrationInterface, QueryRunner } from 'typeorm';

export class Orderedit1743679986354 implements MigrationInterface {
  name = 'Orderedit1743679986354';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "customerEmail" character varying NOT NULL DEFAULT '-'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "customerPhoneNumber" character varying NOT NULL DEFAULT '-'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "customerName" character varying NOT NULL DEFAULT '-'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4198b96eb57d2d18b15028003e" ON "event" ("location") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a7d85b4fc193ac770b9436a7ca" ON "event" ("startDate") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_124059e3850189315f51266fc0" ON "event" ("endDate") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_124059e3850189315f51266fc0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a7d85b4fc193ac770b9436a7ca"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4198b96eb57d2d18b15028003e"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customerName"`);
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "customerPhoneNumber"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customerEmail"`);
  }
}
