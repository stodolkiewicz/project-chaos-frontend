type LabelDTO = {
  id: string;
  name: string;
  color: string;
};

export type LabelResponseDTO = {
  projectId: string;
  labels: LabelDTO[];
};
