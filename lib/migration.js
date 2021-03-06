const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const slugify = text => {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/&/g, '-and-') // Replace & with 'and'
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
};

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://myexpenses-d80db.firebaseio.com'
});

const createBatch = () => admin.firestore().batch();
const db = admin.firestore();
const expensesCol = db.collection('expenses');
const tagsCol = db.collection('tags');

console.debug('Starting Migration Script');

// expensesCol.get().then((querySnapshot) => {
// querySnapshot.forEach((doc) => {
//     console.log("...")
// });
// });

const syncTagUses = async () => {
	let tagsUses = {};
	await expensesCol.get().then(querySnapshot => {
		querySnapshot.docs.map(a => a.data()).forEach(expense => {
			tagsUses[expense.tag] = (tagsUses[expense.tag] || 0) + 1;
		});
	});
	let batch = createBatch();
	await tagsCol.get().then(querySnapshot => {
		querySnapshot.docs.map(tag => {
			const tagName = tag.data().name;
			const tagCurrentUses = tag.data().uses;
			if (tagsUses[tagName] && tagCurrentUses !== tagsUses[tagName]) {
				console.log('Updating', tagName, 'uses from', tagCurrentUses, 'to', tagsUses[tagName]);
				batch.update(tag.ref, { uses: tagsUses[tagName] });
			}
		});
	});
	batch.commit();
};

//syncing tags uses by expenses
syncTagUses().then(() => console.log('Done'));

const useTagNameAsKey = async () => {
	let batch = createBatch();
	await tagsCol.get().then(querySnapshot => {
		querySnapshot.docs.map(tag => {
			const tagName = tag.data().name;
			batch.set(tagsCol.doc(slugify(tagName)), { ...tag.data() });
			batch.delete(tag.ref);
		});
	});
	batch.commit();
};

// useTagNameAsKey().then();
