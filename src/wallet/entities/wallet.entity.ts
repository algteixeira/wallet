import { randomUUID } from "crypto";
import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity('wallet')
export class Wallet {
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  @Unique(['cpf'])
  cpf: string;
  @Column()
  birthdate: string;
  @CreateDateColumn()
  createdAt: Date;
  @CreateDateColumn()
  updatedAt: Date;
  constructor() {
    if (!this.id) {
      this.id = randomUUID();
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  }
}
