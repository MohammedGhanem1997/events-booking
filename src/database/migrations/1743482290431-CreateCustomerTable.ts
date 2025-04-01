import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomerTable1743482290431 implements MigrationInterface {
    name = 'CreateCustomerTable1743482290431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "email" character varying NOT NULL, "firstName" character varying(30) NOT NULL, "lastName" character varying(30) NOT NULL, "phoneNumber" character varying(30) NOT NULL, "password" character varying(255), CONSTRAINT "UQ_fdb2f3ad8115da4c7718109a6eb" UNIQUE ("email"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
