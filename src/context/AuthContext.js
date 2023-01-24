import { useContext, createContext, useEffect, useState } from 'react';
import React from 'react';
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const [loading, setLoading] = useState(true);
    

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
    signInWithRedirect(auth, provider)
  };

  const logOut = () => {
      signOut(auth)
  }

  useEffect(() => {
    const getUser = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = await getDoc(doc(db, `user/${user.uid}`));
          setUser({
            ...user,
            displayName: userRef.data().fullName || null,
            photoURL: userRef.data().photoURL || null,
            username: userRef.data().username || null,
            isVerified: userRef.data().isVerified || false,
          });
          setLoading(false);
        }
        if (!user) {
          setUser(null);
          setLoading(false);
        }
      });
    return getUser();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log('User', currentUser)
    });
    return () => {
      unsubscribe();
    };
    
  }, [user]);

  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await setDoc(
        doc(db, "user", `${user.uid}`),
        {
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );
      setUser(user);
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const signUp = async (email, password, fullname) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
        (user) => {
          console.log(user);
        }
      );
      await sendEmailVerification(user).then(() => {
        // Email sent.
      }).catch((error) => {
        console.log(error)
      });
      await setDoc(
        doc(db, "user/bZdyCDBdUjgxFxhXLRBGzQh05k12"),
        {
          followedBy: arrayUnion(user.uid),
        },
        {
          merge: true,
        }
      );
      await setDoc(doc(db, "user", `${user.uid}`), {
        userId: user.uid,
        fullName: fullname,
        photoURL:
          "https://parkridgevet.com.au/wp-content/uploads/2020/11/Profile-300x300.png",
        email: user.email,
        isVerified: false,
        lastLogin: serverTimestamp(),
      });
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user, signUp, login }}>
      {loading || children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
