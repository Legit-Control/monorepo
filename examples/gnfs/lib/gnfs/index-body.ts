export type IndexBody = {
  link: string;
  type?: 'index' | undefined;
  body?: IndexBody;
}[];
