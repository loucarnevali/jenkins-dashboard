import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class JobDetailsRepository {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column('timestamp')
  date: Date;

  @Column()
  build: string;
}