import React, { useState, useEffect } from "react";
import styled from "styled-components";

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

export const DynamicIcon = ({ iconName }: { iconName: string }) => {
  const [iconSrc, setIconSrc] = useState(undefined);

  useEffect(() => {
    import(`../assets/${iconName}.svg`)
      .then((module) => setIconSrc(module.default))
      .catch((error) => {
        // Handle the error or set a default icon
        console.error("Icon not found:", error);
      });
  }, [iconName]);

  if (!iconSrc) {
    return <IconPlaceholder />;
  }

  return <Icon src={iconSrc} alt={iconName} />;
};

// Usage: <DynamicIcon iconName="yourIconName" />
