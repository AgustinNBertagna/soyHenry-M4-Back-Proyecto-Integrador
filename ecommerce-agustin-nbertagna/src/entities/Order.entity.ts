import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './User.entity';
import { OrderDetails } from './OrderDetails.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'timestamp' })
  date: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.id)
  @JoinColumn({ name: 'orderDetails_id' })
  orderDetails: OrderDetails;
}
