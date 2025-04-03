import { MigrationInterface, QueryRunner } from "typeorm";

export class AuditTable1743686979294 implements MigrationInterface {
    name = 'AuditTable1743686979294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_log" ("id" SERIAL NOT NULL, "action" character varying NOT NULL, "entityType" character varying NOT NULL, "entityId" integer, "oldValue" text, "newValue" text, "performedAt" TIMESTAMP NOT NULL DEFAULT now(), "performedById" integer, CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "auditLogsId" integer`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "customerEmail" SET DEFAULT ' '`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "customerPhoneNumber" SET DEFAULT ' '`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "customerName" SET DEFAULT ' '`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD CONSTRAINT "FK_39b280b0956d0a640437783b6da" FOREIGN KEY ("performedById") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_1e13b459926db854addfe52fa00" FOREIGN KEY ("auditLogsId") REFERENCES "audit_log"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_1e13b459926db854addfe52fa00"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_39b280b0956d0a640437783b6da"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "customerName" SET DEFAULT '-'`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "customerPhoneNumber" SET DEFAULT '-'`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "customerEmail" SET DEFAULT '-'`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "auditLogsId"`);
        await queryRunner.query(`DROP TABLE "audit_log"`);
    }

}
