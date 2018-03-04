'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

function slugify(text) {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/&/g, '-and-') // Replace & with 'and'
		.replace(/[^\w-]+/g, '') // Remove all non-word chars
		.replace(/--+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}

exports.updateTagsCount = functions.firestore.document('/expenses/{expenseId}').onWrite(event => {
	if (event.data.exists) {
		// Expense has been updated \ created
		let doc = event.data.data();
		let oldDoc = event.data.previous.data();

		if (event.data.previous.exists) {
			// Updated
			if (doc.tag !== oldDoc.tag) {
				//Tag has changed
				console.log(
					'Update expense',
					doc.name,
					`(${event.data.id})`,
					'tag from',
					oldDoc.tag,
					'to',
					doc.tag
				);

				let newTagDoc = admin
					.firestore()
					.collection('tags')
					.doc(slugify(doc.tag));
				let prevTagDoc = admin
					.firestore()
					.collection('tags')
					.doc(slugify(oldDoc.tag));

				let prom = [];

				prom.push(
					admin.firestore().runTransaction(t => {
						return t.get(newTagDoc).then(docRef => {
							let currentUses = docRef.data().uses || 0;
							console.log('Increment tag', doc.tag, 'uses to', currentUses + 1);
							return t.update(newTagDoc, { uses: currentUses + 1 });
						});
					})
				);

				prom.push(
					admin.firestore().runTransaction(t => {
						return t.get(prevTagDoc).then(docRef => {
							let currentUses = docRef.data().uses || 1;
							console.log('Decrement tag', oldDoc.tag, 'uses to', currentUses - 1);
							return t.update(prevTagDoc, { uses: currentUses - 1 });
						});
					})
				);

				return Promise.all(prom);
			}
		} else {
			// Created
			console.log('Creating an expense', doc.name);
			let newTagDoc = admin
				.firestore()
				.collection('tags')
				.doc(slugify(doc.tag));
			return admin.firestore().runTransaction(t => {
				return t.get(newTagDoc).then(docRef => {
					let currentUses = docRef.data().uses || 0;
					console.log('Increment tag', doc.tag, 'uses to', currentUses + 1);
					return t.update(newTagDoc, { uses: currentUses + 1 });
				});
			});
		}
	} else {
		// DELETED
		let oldDoc = event.data.previous.data();
		console.log('Deleting an expense', oldDoc.name);
		let prevTagDoc = admin
			.firestore()
			.collection('tags')
			.doc(slugify(oldDoc.tag));
		return admin.firestore().runTransaction(t => {
			return t.get(prevTagDoc).then(docRef => {
				let currentUses = docRef.data().uses || 1;
				console.log('Decrement tag', oldDoc.tag, 'uses to', currentUses - 1);
				return t.update(prevTagDoc, { uses: currentUses - 1 });
			});
		});
	}
	return null;
});
