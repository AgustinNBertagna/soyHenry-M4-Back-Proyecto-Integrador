import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1712886257952 implements MigrationInterface {
    name = 'Initial1712886257952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "stock" integer NOT NULL, "imgUrl" character varying NOT NULL DEFAULT 'https://imgs.search.brave.com/ciA9ZLwOMa4bpRSZEogq80aH06M7rZzOZgQPoBNP7Eo/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9uYXll/bWRldnMuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIwLzAz/L2RlZmF1bHQtcHJv/ZHVjdC1pbWFnZS5w/bmc', "category_id" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ordersDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric(10,2) NOT NULL, CONSTRAINT "PK_d1fff5666a3601a3a7a786a3cd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "user_id" uuid, "orderDetails_id" uuid, CONSTRAINT "REL_2b64efc7cd4057542f3ab8cab2" UNIQUE ("orderDetails_id"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(20) NOT NULL, "phone" integer, "country" character varying(50), "address" text, "city" character varying(50), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders_details_products_products" ("ordersDetailsId" uuid NOT NULL, "productsId" uuid NOT NULL, CONSTRAINT "PK_c6950a54cebf7911d69ff3ae7c7" PRIMARY KEY ("ordersDetailsId", "productsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_20b33011864cbc2067d0083a67" ON "orders_details_products_products" ("ordersDetailsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3b802c251834ab9ca59afd8abe" ON "orders_details_products_products" ("productsId") `);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_2b64efc7cd4057542f3ab8cab29" FOREIGN KEY ("orderDetails_id") REFERENCES "ordersDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders_details_products_products" ADD CONSTRAINT "FK_20b33011864cbc2067d0083a670" FOREIGN KEY ("ordersDetailsId") REFERENCES "ordersDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orders_details_products_products" ADD CONSTRAINT "FK_3b802c251834ab9ca59afd8abe3" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_details_products_products" DROP CONSTRAINT "FK_3b802c251834ab9ca59afd8abe3"`);
        await queryRunner.query(`ALTER TABLE "orders_details_products_products" DROP CONSTRAINT "FK_20b33011864cbc2067d0083a670"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_2b64efc7cd4057542f3ab8cab29"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b802c251834ab9ca59afd8abe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20b33011864cbc2067d0083a67"`);
        await queryRunner.query(`DROP TABLE "orders_details_products_products"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "ordersDetails"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
