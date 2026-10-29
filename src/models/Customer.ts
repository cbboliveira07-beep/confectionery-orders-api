export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  created_at: Date;
  updated_at: Date;
}

export class Customer {
  constructor(
    private readonly customerId: string,
    private readonly customerName: string,
    private readonly customerPhone: string,
    private readonly customerEmail: string | null,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  get id(): string { return this.customerId; }
  get name(): string { return this.customerName; }
  get phone(): string { return this.customerPhone; }
  get email(): string | null { return this.customerEmail; }
  get created_at(): Date { return this.createdAt; }
  get updated_at(): Date { return this.updatedAt; }

  toJSON(): CustomerRecord {
    return {
      id: this.customerId,
      name: this.customerName,
      phone: this.customerPhone,
      email: this.customerEmail,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

export type CreateCustomerDTO = Pick<Customer, "name" | "phone"> & { email?: string | null };
export type UpdateCustomerDTO = Partial<CreateCustomerDTO>;
