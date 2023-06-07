import { Connection } from "@solana/web3.js";

export type Chain = {
  name: string;
  connection: Connection;
  iconUrl?: string | (() => Promise<string>) | null;
};
