export type HistoryItemProps = {
  item: {
    oid: string;
    message: string;
    parent: string[];
    author: {
      timestamp: number;
    };
  };
  isActive: boolean;
  onCheckout: (oid: string) => void;
  getPastState: (commitHash: string) => Promise<string>;
};
