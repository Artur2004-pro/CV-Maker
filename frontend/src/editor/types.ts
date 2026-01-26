export type Block = {
  id: string;
  type: "text" | "section";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  lineHeight: number;
  textColor: string;
  backgroundColor: string;
  borderRadius?: number;
};
