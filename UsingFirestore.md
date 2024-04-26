## Firestore Database Initialization:
## You need to initialize Firestore in your React app.
## This typically happens in your main index.js or App.js file.

```js
    import firebase from 'firebase/app';
    import 'firebase/firestore';

    const firebaseConfig = {
        // Your Firebase config object
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get a reference to the Firestore service
    const firestore = firebase.firestore();
```

## Reading Data from Firestore:

```js
    firestore.collection("yourCollection").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    });
```

## Writing Data to Firestore:

```js
    firestore.collection("yourCollection").add({
        field1: value1,
        field2: value2,
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
```

## Updating Data:

```js
    const docRef = firestore.collection("yourCollection").doc("yourDocumentId");

    docRef.update({
        field1: newValue1,
        field2: newValue2
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });
```

## Deleting Data:

```js
    const docRef = firestore.collection("yourCollection").doc("yourDocumentId");

    docRef.delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
```
