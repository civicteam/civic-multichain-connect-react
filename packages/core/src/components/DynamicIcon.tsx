import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Icon = styled.img`
  margin-right: 10px;
  max-width: 30px;
`;

export const DynamicIcon = ({ iconName }: { iconName: string }) => {
  const [iconSrc, setIconSrc] = useState("");

  useEffect(() => {
    import(`../assets/${iconName}.svg`)
      .then((module) => setIconSrc(module.default))
      .catch((error) => {
        // Handle the error or set a default icon
        console.error("Icon not found:", error);
      });
  }, [iconName]);

  return <Icon src={iconSrc} alt={iconName} />;
};

// Usage: <DynamicIcon iconName="yourIconName" />
