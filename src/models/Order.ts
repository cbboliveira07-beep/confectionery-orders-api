export const occasions = ["birthday", "wedding", "party", "corporate", "other"] as const;
export const statuses = ["pending", "confirmed", "in_production", "ready", "delivered", "cancelled"] as const;

export interface OrderRecord {
  id: string;
  customer_id: string;
  title: string;
  description: string | null;
  occasion: typeof occasions[number] | null;
  delivery_date: Date;
  total_price: number;
  status: typeof statuses[number];
  created_at: Date;
  updated_at: Date;
}

export class Order {
  constructor(
    private readonly orderId: string,
    private readonly customerId: string,
    private readonly orderTitle: string,
    private readonly orderDescription: string | null,
    private readonly orderOccasion: typeof occasions[number] | null,
    private readonly deliveryDate: Date,
    private readonly totalPrice: number,
    private readonly orderStatus: typeof statuses[number],
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  get id(): string { return this.orderId; }
  get customer_id(): string { return this.customerId; }
  get title(): string { return this.orderTitle; }
  get description(): string | null { return this.orderDescription; }
  get occasion(): typeof occasions[number] | null { return this.orderOccasion; }
  get delivery_date(): Date { return this.deliveryDate; }
  get total_price(): number { return this.totalPrice; }
  get status(): typeof statuses[number] { return this.orderStatus; }
  get created_at(): Date { return this.createdAt; }
  get updated_at(): Date { return this.updatedAt; }

  toJSON(): OrderRecord {
    return {
      id: this.orderId,
      customer_id: this.customerId,
      title: this.orderTitle,
      description: this.orderDescription,
      occasion: this.orderOccasion,
      delivery_date: this.deliveryDate,
      total_price: this.totalPrice,
      status: this.orderStatus,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

export type CreateOrderDTO = Pick<Order, "customer_id" | "title" | "total_price"> & {
  delivery_date: string;
  description?: string | null;
  occasion?: Order["occasion"];
  status?: Order["status"];
};
export type UpdateOrderDTO = Partial<CreateOrderDTO>;
