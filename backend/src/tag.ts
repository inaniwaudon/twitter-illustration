export interface Work {
  title: string;
  alias?: string[];
  characters: Character[];
}

export type Character =
  | string
  | {
      name: string;
      color?: string;
    };
