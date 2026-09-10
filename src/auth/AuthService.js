import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase.js";

export class AuthService {
  constructor(firebaseAuth = auth) {
    this.auth = firebaseAuth;
  }

  signUp(email, password) {
    return setPersistence(this.auth, browserLocalPersistence)
      .then(() => createUserWithEmailAndPassword(this.auth, email, password));
  }

  signIn(email, password) {
    return setPersistence(this.auth, browserLocalPersistence)
      .then(() => signInWithEmailAndPassword(this.auth, email, password));
  }

  signOut() {
    return signOut(this.auth);
  }

  subscribe(callback) {
    return onAuthStateChanged(this.auth, callback);
  }
}

export default AuthService;
