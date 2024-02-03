import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useMemo } from "react";
import styled from "styled-components";
import BaseDialog from "./BaseDialog.js";
import {
  BaseChain,
  Chain,
  LabelEntry,
  NetworkConfig,
  SupportedChains,
  icons,
  networkConfigs,
} from "../types.js";
import { useLabel } from "../MultichainLabelProvider.js";
import React from "react";
import { DynamicIcon } from "./DynamicIcon.js";

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
  padding-left: 7px;
  padding-bottom: 6px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 107, 78, 0.2);
  }
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
  font-weight: bold;
`;

const SelectChainList = styled.ul`
  margin-bottom: 20px;
  padding-inline-start: 0px;
  margin-block-start: 0px;
  margin-block-end: 0px;
`;

const StyledTabList = styled(TabList)`
  &&& {
    border-bottom: 1px solid #aaa;
    margin: 0 -30px 10px;
    padding-inline-start: 0px;
    text-align: center;
  }
`;

const StyledTab = styled(Tab)`
  display: inline-block;
  border: none;
  border-bottom: none;
  bottom: -1px;
  position: relative;
  list-style: none;
  padding: 6px 12px;
  cursor: pointer;
  color: #a3a3a3;
  font-size: 18px;
  font-weight: 600;

  &.react-tabs__tab--selected {
    background: #fff;
    border-color: #aaa;
    color: black;
    cursor: pointer;
    border-radius: 0;
    border-bottom: 4px solid #ff6b4e;
  }

  &.react-tabs__tab--disabled {
    cursor: default;
  }
`;

type ChainElementProps<
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
> = {
  chain: Chain<T, S, E>;
  onChainSelect: (chain: Chain<T, S, E>) => void;
};

function getNetworkNameByChainId(
  chainId: number,
  configs: Record<string, NetworkConfig>
): NetworkConfig | undefined {
  for (const name in configs) {
    if (configs[name].chainId === chainId) {
      return configs[name];
    }
  }

  return undefined; // Return undefined if no matching chainId is found
}

export function ChainElement<
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
>({ chain, onChainSelect }: ChainElementProps<T, S, E>): JSX.Element {
  const { type } = chain;

  if (type === SupportedChains.Solana) {
    return (
      <ListItem>
        <ListItemButton type="button" onClick={() => onChainSelect(chain)}>
          <DynamicIcon iconName={SupportedChains.Solana} />
          <ListLabelWithIcon>{chain.name}</ListLabelWithIcon>
        </ListItemButton>
      </ListItem>
    );
  }

  const chainNetwork = getNetworkNameByChainId(chain.id ?? 0, networkConfigs);
  const icon = icons[chainNetwork?.chainId ?? 0];

  if (type === SupportedChains.Ethereum) {
    if (chainNetwork) {
      if (!icon) {
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

  return (
    <ListItem>
      <ListItemButton type="button" onClick={() => onChainSelect(chain)}>
        <DynamicIcon iconName={icon.icon} />
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

  const hasTestnetChains = useMemo(
    () => chains.filter((chain) => chain.testnet === true)?.length >= 1,
    [chains]
  );
  const hasMainnetChains = useMemo(
    () => chains.filter((chain) => chain.testnet !== true)?.length >= 1,
    [chains]
  );

  // TODO: CPASS-464 Fix the order of the diplayed chains
  // only show tabs if we have test and mainnet chains
  return (
    <div>
      <SelectChainTitle>{labels[LabelEntry.SELECT_CHAIN]}</SelectChainTitle>
      {hasMainnetChains && hasTestnetChains ? (
        <>
          <Tabs>
            <StyledTabList>
              <StyledTab>Mainnet</StyledTab>
              {hasTestnetChains && <StyledTab>Testnet</StyledTab>}
            </StyledTabList>

            <TabPanel>
              <SelectChainList>
                {chains
                  .filter((chain) => (chain.testnet || false) === false)
                  .map((chain) => (
                    <ChainElement
                      key={chain.name}
                      chain={chain}
                      onChainSelect={onChainSelect}
                    />
                  ))}
              </SelectChainList>
            </TabPanel>
            {hasTestnetChains && (
              <TabPanel>
                <SelectChainList>
                  {chains
                    .filter((chain) => chain.testnet === true)
                    .map((chain) => (
                      <ChainElement
                        key={chain.name}
                        chain={chain}
                        onChainSelect={onChainSelect}
                      />
                    ))}
                </SelectChainList>
              </TabPanel>
            )}
          </Tabs>
        </>
      ) : (
        <SelectChainList>
          {chains.map((chain) => (
            <ChainElement
              key={chain.name}
              chain={chain}
              onChainSelect={onChainSelect}
            />
          ))}
        </SelectChainList>
      )}
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
