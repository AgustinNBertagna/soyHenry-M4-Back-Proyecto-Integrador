import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { OrderDetails } from './OrderDetails.entity';
import { Category } from './Category.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column({
    type: 'varchar',
    default:
      'https://imgs.search.brave.com/ciA9ZLwOMa4bpRSZEogq80aH06M7rZzOZgQPoBNP7Eo/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9uYXll/bWRldnMuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIwLzAz/L2RlZmF1bHQtcHJv/ZHVjdC1pbWFnZS5w/bmc',
  })
  imgUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;

  @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
  ordersDetails: OrderDetails[];
}
