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
    "https://keya-web-default-rtdb." + "europe-west1.firebasedatabase.app",
});

export const registerUser = functions.https.onCall(async (data) => {
  try {
    const {
      email,
      password,
      confirmpassword,
      firstName,
      lastName,
      ...rest
    } = data;

    if (password !== confirmpassword) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Password and confirm password do not match."
      );
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    const usersCollectionRef = admin.firestore().collection("users");

    const userData = {
      id: userRecord.uid,
      uid: userRecord.uid,
      searchIndexEmail: email,
      searchIndexName: firstName + " " + lastName,
      firstName: firstName,
      lastName: lastName,
      ...rest,
    };

    await usersCollectionRef.doc(userRecord.uid).set(userData);

    return {
      success: true,
      message: "User registered successfully.",
      userData: userData,
    };
  } catch (error) {
    console.error("Error when registering user:", error);
    throw new functions.https.HttpsError(
      "unknown",
      "Error when registering user.",
      error
    );
  }
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

export const updateEmail = functions.https.onCall(async (data) => {
  await admin.auth().updateUser(data.uid, {
    email: data.newEmail,
    emailVerified: true,
  });
});
