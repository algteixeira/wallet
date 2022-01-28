import { Exclude } from "class-transformer";
import { randomUUID } from "crypto";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./transaction.entity";
import { Wallet } from "./wallet.entity";

@Entity('coin')
export class Coin {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    coin: string;
    @Column()
    fullname: string;
    @Column({type: 'decimal'})
    amount;
    @ManyToOne(() => Wallet, (wallet) => wallet.coins)
    wallet: Wallet;
    @OneToMany(() => Transaction, (transaction) => transaction.coin, {eager:true})
    transactions: Transaction[];
    constructor() {
        if (!this.id) {
          this.id = randomUUID();
        }
    }
}
