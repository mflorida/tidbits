import ya from './yadel';
import { tags, voidTags } from './tagList';

export const yadelTags = {
  ...[].concat(tags, voidTags).reduce((fns, tag) => {
    fns[tag] = (...args) => ya(tag, ...args);
    return fns;
  }, {})
} as const;
