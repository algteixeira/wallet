import { randomUUID } from "crypto";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Coin } from "./coin.entity";

@Entity('transaction')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({type: 'decimal'})
    value;
    @Column()
    datetime: Date;
    @ManyToOne(() => Coin, (coin) => coin.transactions)
    coin: Coin;
    @Column()
    sendTo: string;
    @Column()
    receiveFrom: string;
    @Column({type: 'decimal'})
    currentCotation;
    constructor() {
        if (!this.id) {
          this.id = randomUUID();
          this.datetime = new Date();
        }
    }
}
