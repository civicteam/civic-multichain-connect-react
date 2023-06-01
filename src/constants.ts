import { LabelEntry } from "./types";

export const defaultLabels: Record<LabelEntry, string> = {
  [LabelEntry.CONNECT]: "Connect",
  [LabelEntry.CONNECTED]: "Connected",
  [LabelEntry.DISCONNECT]: "Disconnect",
  [LabelEntry.DISCONNECTED]: "Disconnected",
  [LabelEntry.SELECT_CHAIN]: "Connect to a chain",
  [LabelEntry.OTHER]: "Other",
};
