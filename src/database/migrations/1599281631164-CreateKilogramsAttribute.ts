import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class CreateKilogramsAttribute1599281631164
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "kilograms",
        type: "float",
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "kilograms");
  }
}
