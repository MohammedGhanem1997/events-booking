import { Exclude, Expose } from 'class-transformer';

export class CustomerResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;
  @Exclude()
  deletedAt: Date | null;

  constructor(partial: Partial<CustomerResponseDto>) {
    Object.assign(this, partial);
  }
}
