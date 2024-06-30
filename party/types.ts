export type Poll = {
  title: string;
  options: string[];
  votes?: number[];
};

export type Rooms = {
  [key: string]: number;
};
export const SINGLETON_ROOM_ID = "index";
