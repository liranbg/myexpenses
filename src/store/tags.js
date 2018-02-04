import store, { useMock } from '../store';
import { setTags } from "../actions";
import { addTag as addTagFirebase } from "../firebase/tags";

export const addTag = (tagName) => {
  console.log("Adding:", tagName);
  if (useMock)
    return store.dispatch(setTags([...store.getState().tags, {
      key: (store.getState().tags.length + 10).toString(),
      name: tagName
    }
    ]));
  else
    return store.dispatch(setTags([...store.getState().tags, addTagFirebase(tagName)]));
};
