import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  DELIVERED = 'DELIVERED',
}

export class BaseOrder {
  @Column()
  productName: string;
  @Column()
  quanity: number;
  @Column()
  price: number;
  @Column()
  total: number;
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}

@Entity({ name: 'orders' })
export class Order extends BaseOrder {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', default: OrderStatus.CREATED, enum: OrderStatus })
  status: OrderStatus;
}
