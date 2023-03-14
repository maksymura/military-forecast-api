export type ParsePageResult = {
  shouldContinue: boolean;
  parsedPosts: ParsedPost[];
};

export type ParsedPost = {
  date: string;
  words: string[];
};
