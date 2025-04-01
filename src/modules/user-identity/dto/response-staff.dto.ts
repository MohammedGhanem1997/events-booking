import { Exclude, Expose } from 'class-transformer';

export class StaffResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  @Exclude()
  password: string;

  constructor(partial: Partial<StaffResponseDto>) {
    Object.assign(this, partial);
  }
}
