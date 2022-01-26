import { Exclude } from "class-transformer";
import { randomUUID } from "crypto";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryColumn, Unique } from "typeorm";
import { Coin } from "./coin.entity";

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
  @Exclude()
  @OneToMany(() => Coin, (coin) => coin.wallet)
  coins: Coin[];
  constructor() {
    if (!this.id) {
      this.id = randomUUID();
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  }
}
