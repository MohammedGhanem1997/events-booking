import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { RoleResponseDto } from './dto/role-response.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = this.roleRepo.create(createRoleDto);

    if (createRoleDto.permissions) {
      role.permissions = await this.permissionRepo.findByIds(
        createRoleDto.permissions.map((p) => p.id),
      );
    }

    const savedRole = await this.roleRepo.save(role);
    return plainToInstance(RoleResponseDto, savedRole);
  }

  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepo.find({ relations: ['permissions'] });
    return plainToInstance(RoleResponseDto, roles);
  }

  async find(obj: object) {
    const role = await this.roleRepo.findOne({
      where: obj,
      relations: ['permissions'],
    });

    return plainToInstance(RoleResponseDto, role);
  }

  async findOne(id: number): Promise<RoleResponseDto> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
    return plainToInstance(RoleResponseDto, role);
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const role = await this.roleRepo.preload({
      id,
      ...updateRoleDto,
    });

    if (!role) {
      throw new Error('Role not found');
    }

    if (updateRoleDto.permissions) {
      role.permissions = await this.permissionRepo.findByIds(
        updateRoleDto.permissions.map((p) => p.id),
      );
    }

    const updatedRole = await this.roleRepo.save(role);
    return plainToInstance(RoleResponseDto, updatedRole);
  }

  async remove(id: number): Promise<void> {
    await this.roleRepo.softDelete(+id);
  }
}

// async getStaffPermissions(roleId: number) {
//   const role = await this.roleRepo.findOne({
//     where: { id: roleId },
//     relations: ['permissions'],
//   });
//   return role ? role.permissions : [];
// }
