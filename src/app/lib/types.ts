export type Task = {
  title: string;
  description: string;
  status: string;
  user: string;
};

export type TaskDisplay = {
  id: string;
  title: string;
  description: string;
  status: string;
  user?: string;
};
