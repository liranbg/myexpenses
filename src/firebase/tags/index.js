import { db } from '../firebase';

export const tagsCollection = db.collection("tags");

export const addTag = (tagName) => tagsCollection
.add({name: tagName, uses: 0})
.then(newTag => ({key: newTag.id, name: tagName, uses: 0}));

export const deleteTag = (tagKey) => tagsCollection.doc(tagKey).delete();

export const incTagUses = (tagKey) => tagsCollection.doc(tagKey)
.get().then(doc => tagsCollection.doc(tagKey)
.update({uses: doc.data().uses + 1}));

export const decTagUses = (tagKey) => tagsCollection.doc(tagKey)
.get().then(doc => tagsCollection.doc(tagKey)
.update({uses: doc.data().uses - 1}));
