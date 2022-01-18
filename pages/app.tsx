import { Button } from "@mui/material";
import { ReactElement } from "react";

import { auth, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";


export default function App(): ReactElement {
  // Tracking user authentication state
  const [user, loading, error] = useAuthState(auth);

  // Button for Google Sign In
  function GoogleSignInButton(): ReactElement {
    const signInWithGoogle = async () => {
      try {
        await signInWithPopup(auth, googleAuthProvider);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Button
        className="
        px-4 py-2 rounded-xl hidden tiny:flex flex-col
        bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200"
        variant="contained"
        color="primary"
        onClick={signInWithGoogle}>
        <span className="text-white dark:text-slate-800 text-lg hidden md:block">
          Sign in With Google
        </span>
      </Button>
    );
  }

  // Button for Sign Out
  function SignOutButton(): ReactElement {
    const signOut = async () => {
      try {
        await auth.signOut();
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Button
        className="
        px-4 py-2 rounded-xl hidden tiny:flex flex-col
        bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200"
        variant="contained"
        color="primary"
        onClick={signOut}>
        <span className="text-white dark:text-slate-800 text-lg hidden md:block">
          Sign Out
        </span>
      </Button>
    );
  }


  return (
    <main className="grow flex flex-row justify-evenly items-center flex-wrap gap-x-5 gap-y-5">
      <h1>
        This is where the app should go
      </h1>
      {user ? user.uid : "Signed Out"}
      {user ? <SignOutButton /> : <GoogleSignInButton />}
      <h1>Hi</h1>
    </main>
  );
}
