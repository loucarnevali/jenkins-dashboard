import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class JobDetailsEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @Column('timestamp')
  date!: Date;

  @Column()
  build!: string;

  constructor(name: string, color: string, date: Date, build: string) {
    this.name = name;
    this.color = color;
    this.date = date;
    this.build = build;
  }
}