import { LabelEntry } from "./types.js";

export const defaultLabels: Record<LabelEntry, string> = {
  [LabelEntry.CONNECT]: "Connect",
  [LabelEntry.CONNECTED]: "Connected",
  [LabelEntry.DISCONNECT]: "Disconnect",
  [LabelEntry.DISCONNECTED]: "Disconnected",
  [LabelEntry.SELECT_CHAIN]: "Choose network",
  [LabelEntry.OTHER]: "Other",
};
