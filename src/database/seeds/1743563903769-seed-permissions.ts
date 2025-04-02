import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPermissions1743563903769 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "permission" ("id", "name", "description", "action", "path", "method")
        VALUES 
          -- Customer Endpoints
          (uuid_generate_v4(), 'customer_add', 'Create customers', 'add', '/api/v1/user-identity/customers', 'POST'),
          (uuid_generate_v4(), 'customer_update', 'Update customers', 'update', '/api/v1/user-identity/customers/:id', 'PUT'),
          (uuid_generate_v4(), 'customer_view_all', 'View all customers', 'view', '/api/v1/user-identity/customers/all', 'GET'),
          (uuid_generate_v4(), 'customer_view', 'View customer details', 'view', '/api/v1/user-identity/customers/:id', 'GET'),
          
          -- Staff Endpoints
          (uuid_generate_v4(), 'staff_add', 'Create staff', 'add', '/api/v1/user-identity/staffs', 'POST'),
          (uuid_generate_v4(), 'staff_update', 'Update staff', 'update', '/api/v1/user-identity/staffs/:id', 'PUT'),
          (uuid_generate_v4(), 'staff_view_all', 'View all staff', 'view', '/api/v1/user-identity/staffs/all', 'GET'),
          (uuid_generate_v4(), 'staff_view', 'View staff details', 'view', '/api/v1/user-identity/staffs/:id', 'GET'),
          (uuid_generate_v4(), 'staff_delete', 'Delete staff', 'delete', '/api/v1/user-identity/staffs/:id', 'DELETE'),
          
          -- Role Endpoints
          (uuid_generate_v4(), 'role_add', 'Create roles', 'add', '/api/v1/roles', 'POST'),
          (uuid_generate_v4(), 'role_view_all', 'View all roles', 'view', '/api/v1/roles', 'GET'),
          (uuid_generate_v4(), 'role_view', 'View role details', 'view', '/api/v1/roles/:id', 'GET'),
          (uuid_generate_v4(), 'role_update', 'Update roles', 'update', '/api/v1/roles/:id', 'PUT'),
          (uuid_generate_v4(), 'role_delete', 'Delete roles', 'delete', '/api/v1/roles/:id', 'DELETE'),
          
          -- Permission Endpoints
          (uuid_generate_v4(), 'permission_view', 'View permission details', 'view', '/api/v1/permission/:id', 'GET'),
          
          -- Auth Endpoints
          (uuid_generate_v4(), 'auth_login', 'User login', 'post', '/api/v1/auth/login', 'POST'),
          (uuid_generate_v4(), 'auth_profile', 'View profile', 'view', '/api/v1/auth/profile', 'GET');
      `);

    // Assign permissions to admin role
    await queryRunner.query(`
        INSERT INTO "role_permissions_permission" ("roleId", "permissionId")
        SELECT 
          (SELECT id FROM "role" WHERE name = 'admin') as "roleId",
          id as "permissionId"
        FROM "permission";
      `);

    // Assign basic permissions to user role
    await queryRunner.query(`
        INSERT INTO "role_permissions_permission" ("roleId", "permissionId")
        VALUES
          ((SELECT id FROM "role" WHERE name = 'user'), 
           (SELECT id FROM "permission" WHERE name = 'auth_login')),
          
          ((SELECT id FROM "role" WHERE name = 'user'), 
           (SELECT id FROM "permission" WHERE name = 'auth_profile')),
           
          ((SELECT id FROM "role" WHERE name = 'user'), 
           (SELECT id FROM "permission" WHERE name = 'customer_view'));
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "role_permissions_permission"`);
    await queryRunner.query(`DELETE FROM "permission"`);
  }
}
