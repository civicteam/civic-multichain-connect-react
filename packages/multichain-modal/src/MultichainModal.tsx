import React from "react";
import styled from "styled-components";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useMultichainModal } from "./MultichainModalContext.js";
import { Chain } from "./types.js";

// Styled components
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  min-width: 420px;
`;

const CloseButton = styled.button`
  position: absolute;
  background-color: transparent;
  border-color: transparent;
  border-width: 0px;
  top: 10px;
  right: 10px;
  cursor: pointer;
  padding: 0px;
  margin: 0px;
`;

const CloseButtonSvg = styled.svg`
  height: 20px;
  width: 20px;
  color: #a3a3a3;
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

const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
`;

const ListItemButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
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

const ListLabelWithIcon = styled.span`
  margin-right: 10px;
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

interface MultichainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultichainModal: React.FC<MultichainModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { chains, setSelectedChain, setIsConnected } = useMultichainModal();

  const handleChainSelect = (chain: Chain) => {
    setSelectedChain(chain);
    setIsConnected(true);
    onClose();
  };

  const mainnetChains = chains.filter((chain) => !chain.testnet);
  const testnetChains = chains.filter((chain) => chain.testnet);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalWrapper>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <CloseButtonSvg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </CloseButtonSvg>
        </CloseButton>
        <SelectChainTitle>Select a Chain</SelectChainTitle>
        <Tabs>
          <StyledTabList>
            <StyledTab>Mainnet</StyledTab>
            {testnetChains.length > 0 && <StyledTab>Testnet</StyledTab>}
          </StyledTabList>

          <TabPanel>
            <SelectChainList>
              {mainnetChains.map((chain) => (
                <ListItem key={chain.id}>
                  <ListItemButton onClick={() => handleChainSelect(chain)}>
                    {chain.icon && <img src={chain.icon} alt={chain.name} />}
                    <ListLabelWithIcon>{chain.name}</ListLabelWithIcon>
                  </ListItemButton>
                </ListItem>
              ))}
            </SelectChainList>
          </TabPanel>
          {testnetChains.length > 0 && (
            <TabPanel>
              <SelectChainList>
                {testnetChains.map((chain) => (
                  <ListItem key={chain.id}>
                    <ListItemButton onClick={() => handleChainSelect(chain)}>
                      {chain.icon && <img src={chain.icon} alt={chain.name} />}
                      <ListLabelWithIcon>{chain.name}</ListLabelWithIcon>
                    </ListItemButton>
                  </ListItem>
                ))}
              </SelectChainList>
            </TabPanel>
          )}
        </Tabs>
      </ModalContent>
    </ModalWrapper>
  );
};
