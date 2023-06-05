import {
  getNetwork,
  lookupEvmChainNetworkById,
} from "@civic/civic-eth-provider";
import {
  getIconInfo,
  SupportedSymbolArray,
  SupportedSymbol,
} from "@civic/civic-chain-icons";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BaseDialog from "../components/BaseDialog";
import { Chain, ChainType, EVMChain, LabelEntry } from "../types";
import { useLabel } from "../LabelProvider";
import * as R from "ramda";

const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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

const SelectChainTitle = styled.h4`
  margin-bottom: 20px;
  margin-top: 20px;
  text-align: center;
  font-size: 24px;
`;

const SelectChainList = styled.ul`
  margin-bottom: 20px;
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
  const [iconUrl, setIconUrl] = useState<string | undefined>(
    getIconInfo(symbol)?.icon
  );
  useEffect(() => {
    if (chain.iconUrl && R.type(chain.iconUrl) === "Function") {
      (chain.iconUrl as () => Promise<string>)().then(setIconUrl);
    } else if (chain.iconUrl && R.type(chain.iconUrl) === "String") {
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

export type ChainSelectorProps = {
  chains: Chain[];
  onChainSelect: (chain: Chain) => void;
};

export function ChainSelectorContent({
  chains,
  onChainSelect,
}: ChainSelectorProps): JSX.Element | null {
  const { labels } = useLabel();
  console.log("ChainSelectorContent", chains);
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
  onClose: () => void;
  onChainSelect: (chain: Chain) => void;
};

export function ChainSelectorModal({
  chains,
  isOpen,
  onClose,
  onChainSelect,
}: ChainSelectorModalProps): JSX.Element {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <ChainSelectorContent chains={chains} onChainSelect={onChainSelect} />
    </BaseDialog>
  );
}
