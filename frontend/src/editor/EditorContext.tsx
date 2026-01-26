import { createContext, useContext, useState, type ReactNode } from "react";
import { type Block } from "./types";
import { type UserProfile } from "../types";

type EditorContextType = {
  blocks: Block[];
  setBlocks: (blocks: Block[] | ((prev: Block[]) => Block[])) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
};

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  return (
    <EditorContext.Provider
      value={{
        blocks,
        setBlocks,
        selectedId,
        setSelectedId,
        profile,
        setProfile,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
  return ctx;
};
