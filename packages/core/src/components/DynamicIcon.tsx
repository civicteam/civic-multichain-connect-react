import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BaseChain } from "../types.js";

const IconPlaceholder = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 30px;
`;

const Icon = styled.img`
  margin-right: 10px;
  width: 30px;
`;

export const DynamicIcon = ({ chain }: { chain: BaseChain }) => {
  const [iconSrc, setIconSrc] = useState<string | undefined>(undefined);
  const { iconUrl, type, name: iconName } = chain;

  useEffect(() => {
    const loadIcon = async () => {
      try {
        if (typeof iconUrl === "string") {
          setIconSrc(iconUrl);
        } else if (typeof iconUrl === "function") {
          const resolvedUrl = await iconUrl();
          setIconSrc(resolvedUrl);
        } else {
          // If iconUrl is undefined or not a string/function, load from assets
          // lowercase the icon name to match the file name and split by spaces to handle multi-word names
          // take the first word and use it as the file name
          const name = iconName.split(" ")[0].toLocaleLowerCase();
          const module = await import(`../assets/${name}.svg`);
          setIconSrc(module.default);
        }
      } catch (error) {
        console.error("Failed to load icon:", error);
        const module = await import(`../assets/${type}.svg`);
        console.log("module", module);
        setIconSrc(module.default);
      }
    };

    loadIcon();
  }, [iconUrl, iconName]);

  if (!iconSrc) {
    return <IconPlaceholder />;
  }

  return <Icon src={iconSrc} alt={iconName} />;
};

// set default props
DynamicIcon.defaultProps = {
  iconUrl: undefined,
};
