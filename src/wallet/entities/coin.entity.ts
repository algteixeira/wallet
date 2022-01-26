import { randomUUID } from "crypto";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
    constructor() {
        if (!this.id) {
          this.id = randomUUID();
        }
    }
}
