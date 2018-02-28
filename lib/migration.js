const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://myexpenses-d80db.firebaseio.com"
});

const db = admin.firestore();
const expensesCol = db.collection("expenses");

console.log("Starting Migration Script");

expensesCol.get().then((querySnapshot) => {
    // querySnapshot.forEach((doc) => {
    //     console.log("...")
    // });
});






