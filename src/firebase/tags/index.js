import { db } from '../firebase';

export const tagsCollection = db.collection("tags");

export const addTag = (tagName) => {
  let doc = tagsCollection.doc().set({name: tagName});
  return {
    key: doc.id,
    name: tagName
  };
};

export const deleteTag = (tagKey) => tagsCollection.doc(tagKey).delete();
