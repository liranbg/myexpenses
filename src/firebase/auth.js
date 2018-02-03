import { auth, authGoogleProvider } from './firebase';


// Sign out
export const doSignOut = () =>
  auth.signOut();

export const onAuthStateChanged = (cb) => auth.onAuthStateChanged(cb);
