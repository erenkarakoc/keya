/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequire} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import * as serviceAccount from "./serviceAccountKey.json";

const serviceAccountConfig: admin.ServiceAccount =
  serviceAccount as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountConfig),
  databaseURL:
    "https://alert-port-421202-default-rtdb." +
    "europe-west1.firebasedatabase.app",
});

export const deleteUser = functions.https.onCall(async (data) => {
  try {
    await admin.auth().deleteUser(data.uid);
    const userDocRef = admin.firestore().collection("users").doc(data.uid);
    await userDocRef.delete();
    console.log(`Successfully deleted user with UID: ${data.uid}`);
  } catch (error) {
    console.error(`Error deleting user: ${data.uid}`, error);
    throw error;
  }
});
