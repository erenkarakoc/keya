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

import * as admin from "firebase-admin";
import * as jwt from "jsonwebtoken";
import {getAuth, signInWithCustomToken} from "firebase/auth";

import {onCall, HttpsError} from "firebase-functions/v2/https";

admin.initializeApp();

export const login = onCall(async (req) => {
  try {
    const {email, DATABASE_SECRET} = req.data;
    const userRecord = await admin.auth().getUserByEmail(email);
    const payload = {uid: userRecord.uid};
    const customToken = jwt.sign(payload, DATABASE_SECRET, {expiresIn: "1h"});
    return {api_token: customToken};
  } catch (error) {
    console.error("Error getting user:", error);
    throw new HttpsError("internal", "Internal Server Error");
  }
});

export const verifyToken = onCall(async (req) => {
  try {
    const {apiToken} = req.data;
    const auth = getAuth();
    const userCredential = await signInWithCustomToken(auth, apiToken);
    return userCredential.user;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new HttpsError("internal", "Internal Server Error");
  }
});
