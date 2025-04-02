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
  role: Role | null;

  @Exclude()
  password: string;

  @Exclude()
  deletedAt: Date | null;

  constructor(partial: Partial<StaffResponseDto>) {
    Object.assign(this, partial);
  }
}
