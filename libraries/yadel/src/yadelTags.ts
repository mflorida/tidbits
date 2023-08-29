import yadel from './yadel';
import { tags, voidTags } from './tags';

export default {
  ...[].concat(tags, voidTags).reduce((fns, tag) => {
    fns[tag] = (...args) => yadel(tag, ...args);
    return fns;
  }, {})
};
