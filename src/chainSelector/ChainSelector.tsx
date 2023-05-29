import {
  getNetwork,
  lookupEvmChainNetworkById,
} from "@civic/civic-eth-provider";
import {
  getIconInfo,
  SupportedSymbolArray,
  SupportedSymbol,
} from "@civic/civic-chain-icons";
import React from "react";
import styled from "styled-components";
import BaseDialog from "../components/BaseDialog";
import { Chain, ChainType, EVMChain, LabelEntry } from "../types";
import { useLabel } from "../LabelProvider";

const ListItem = styled.li`
  display: flex;
  align-items: center;
`;

const ListItemButton = styled.button`
  display: flex;
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

const SelectChainTitle = styled.div`
  margin-bottom: 10px;
`;

const SelectChainList = styled.ul`
  margin-bottom: 10px;
`;
type ChainElementProps = {
  chain: Chain;
  onChainSelect: (chain: Chain) => void;
};

export function ChainElement({
  chain,
  onChainSelect,
}: ChainElementProps): JSX.Element {
  const { type } = chain;

  let ethSymbol;
  if (type === ChainType.Ethereum) {
    const chainNetwork = lookupEvmChainNetworkById((chain as EVMChain).id);
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
  return (
    <ListItem>
      <ListItemButton type="button" onClick={() => onChainSelect(chain)}>
        <Icon src={getIconInfo(symbol)?.icon} alt="" />
        <ListLabelWithIcon>{chain.name}</ListLabelWithIcon>
      </ListItemButton>
    </ListItem>
  );
}

export type ChainSelectorProps = {
  chains: Chain[];
  onChainSelect: (chain: Chain) => void;
};

export function ChainSelectorContent({
  chains,
  onChainSelect,
}: ChainSelectorProps): JSX.Element | null {
  const { labels } = useLabel();
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
export type ChainSelectorModalProps = {
  chains: Chain[];
  isOpen: boolean;
  onClose?: () => void;
  contentClassName?: string;
  onChainSelect: (chain: Chain) => void;
};

export function ChainSelectorModal({
  chains,
  isOpen,
  onClose,
  contentClassName,
  onChainSelect,
}: ChainSelectorModalProps): JSX.Element {
  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={contentClassName}
    >
      <ChainSelectorContent chains={chains} onChainSelect={onChainSelect} />
    </BaseDialog>
  );
}

ChainSelectorModal.defaultProps = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose: () => {},
  contentClassName: "max-w-lg",
};
