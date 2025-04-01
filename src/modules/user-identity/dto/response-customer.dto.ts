import { Exclude, Expose } from 'class-transformer';

export class CustomerResponseDto {
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

  constructor(partial: Partial<CustomerResponseDto>) {
    Object.assign(this, partial);
  }
}
