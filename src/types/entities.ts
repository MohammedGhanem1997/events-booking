export interface IBaseEntity {
  updatedAt?: string;
  createdAt?: string;
  deletedAt?: string;
}

export interface IBaseEntityWithId extends IBaseEntity {
  id?: number;
}

export interface IBaseEntityWithMeta extends IBaseEntityWithId {
  createdBy?: string;
  updatedBy?: string;
}
