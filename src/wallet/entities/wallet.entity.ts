import { randomUUID } from "crypto";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('wallet')
export class Wallet {
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  cpf: string;
  @Column()
  birthdate: string;
  constructor() {
    if (!this.id) {
      this.id = randomUUID();
    }
  }
}
