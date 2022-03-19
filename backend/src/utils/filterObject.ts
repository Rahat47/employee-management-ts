// export a function that filters an object by given keys, and returns a new object.
// this function will use lodash to filter the object.

import { pick } from 'lodash';

export const filterObject = <T>(object: T, keys: string[]) => {
    return pick<T>(object, keys);
};
