import { Exclude, Expose } from 'class-transformer';
import { Role } from 'src/modules/role/entities/role.entity';

export class StaffResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  role: Role | null;

  @Exclude()
  password: string;

  constructor(partial: Partial<StaffResponseDto>) {
    Object.assign(this, partial);
  }
}
