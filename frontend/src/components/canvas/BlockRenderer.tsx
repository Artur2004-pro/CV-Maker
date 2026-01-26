import React from "react";
import { TextBlock } from "../blocks/TextBlock";
import { SectionBlock } from "../blocks/SectionBlock";
import type { Block } from "../editor/types";

export const BlockRenderer: React.FC<{ block: Block }> = ({ block }) => {
  switch (block.type) {
    case "text":
      return <TextBlock block={block} />;
    case "section":
      return <SectionBlock block={block} />;
    default:
      return null;
  }
};
