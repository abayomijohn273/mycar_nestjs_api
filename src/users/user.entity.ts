import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  //   Code below are hooks
  @AfterInsert()
  logInsert() {
    console.log('Insert user with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Update user with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Remove user with id ', this.id);
  }
}
