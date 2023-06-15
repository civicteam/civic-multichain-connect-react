import {
  getNetwork,
  lookupEvmChainNetworkById,
} from "@civic/civic-eth-provider";
import {
  getIconInfo,
  SupportedSymbolArray,
  SupportedSymbol,
} from "@civic/civic-chain-icons";
import { useEffect, useState } from "react";
import styled from "styled-components";
import BaseDialog from "./BaseDialog.js";
import { BaseChain, Chain, LabelEntry, SupportedChains } from "../types.js";
import { useLabel } from "../MultichainLabelProvider.js";
import React from "react";

const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
`;

const ListItemButton = styled.button`
  width: 100%;
  display: flex;
  border: 0;
  background-color: transparent;
  background-image: none;
  border-color: transparent;
  border-width: 0px;
  border-radius: 20px;
  display: flex;
  font-size: 18px;
  line-height: 28px;
  padding-top: 6px;
  padding-bottom: 6px;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;

const Icon = styled.img`
  margin-right: 10px;
`;

const ListLabelNoIcon = styled.span`
  margin-right: 10px;
`;

const ListLabelWithIcon = styled.span`
  margin-right: 10px;
`;

const SelectChainTitle = styled.h4`
  margin-bottom: 20px;
  margin-top: 20px;
  text-align: center;
  font-size: 24px;
  font-weight: 400;
`;

const SelectChainList = styled.ul`
  margin-bottom: 20px;
  padding-inline-start: 0px;
  margin-block-start: 0px;
  margin-block-end: 0px;
`;
type ChainElementProps<
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
> = {
  chain: Chain<T, S, E>;
  onChainSelect: (chain: Chain<T, S, E>) => void;
};

export function ChainElement<
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
>({ chain, onChainSelect }: ChainElementProps<T, S, E>): JSX.Element {
  const { type } = chain;
  let ethSymbol;

  if (type === SupportedChains.Ethereum) {
    const chainNetwork = lookupEvmChainNetworkById(chain.id ?? 0);
    if (chainNetwork) {
      ethSymbol = getNetwork(chainNetwork)?.symbol;
      if (
        !ethSymbol ||
        !SupportedSymbolArray.includes(ethSymbol as SupportedSymbol)
      ) {
        return (
          <ListItem>
            <ListItemButton type="button" onClick={() => onChainSelect(chain)}>
              <ListLabelNoIcon>{chain.name}</ListLabelNoIcon>
            </ListItemButton>
          </ListItem>
        );
      }
    }
  }
  const symbol = (ethSymbol as SupportedSymbol) || "SOL";
  const [iconUrl, setIconUrl] = useState<string | undefined>(
    getIconInfo(symbol)?.icon
  );
  useEffect(() => {
    if (chain.iconUrl && typeof chain.iconUrl === "function") {
      (chain.iconUrl as () => Promise<string>)().then(setIconUrl);
    } else if (chain.iconUrl && typeof chain.iconUrl === "string") {
      setIconUrl(chain.iconUrl as string);
    }
  }, [chain]);

  return (
    <ListItem>
      <ListItemButton type="button" onClick={() => onChainSelect(chain)}>
        <Icon src={iconUrl} alt="" />
        <ListLabelWithIcon>{chain.name}</ListLabelWithIcon>
      </ListItemButton>
    </ListItem>
  );
}

export type ChainSelectorProps<
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
> = {
  chains: Chain<T, S, E>[];
  onChainSelect: (chain: Chain<T, S, E>) => void;
};

export function ChainSelectorContent<
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
>({ chains, onChainSelect }: ChainSelectorProps<T, S, E>): JSX.Element | null {
  const { labels } = useLabel();
  // TODO: CPASS-464 Fix the order of the diplayed chains
  return (
    <div>
      <SelectChainTitle>{labels[LabelEntry.SELECT_CHAIN]}</SelectChainTitle>
      <SelectChainList>
        {chains.map((chain) => (
          <ChainElement
            key={chain.name}
            chain={chain}
            onChainSelect={onChainSelect}
          />
        ))}
      </SelectChainList>
    </div>
  );
}
export type ChainSelectorModalProps<
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
> = {
  chains: Chain<T, S, E>[];
  isOpen: boolean;
  onClose: () => void;
  onChainSelect: (chain: Chain<T, S, E>) => void;
};

export function ChainSelectorModal<
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
>({
  chains,
  isOpen,
  onClose,
  onChainSelect,
}: ChainSelectorModalProps<T, S, E>): JSX.Element {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <ChainSelectorContent chains={chains} onChainSelect={onChainSelect} />
    </BaseDialog>
  );
}
