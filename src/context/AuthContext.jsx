import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
  } from "firebase/auth";
  
  import { auth } from "../services/firebase";
  
  const AuthContext = createContext();
  
  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      return onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
        }
      );
    }, []);
  
    const login = async () => {
      const provider =
        new GoogleAuthProvider();
  
      await signInWithPopup(
        auth,
        provider
      );
    };
  
    const logout = async () => {
      await signOut(auth);
    };
  
    return (
      <AuthContext.Provider
        value={{
          user,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export const useAuth = () =>
    useContext(AuthContext);