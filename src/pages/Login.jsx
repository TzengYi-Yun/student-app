import {
    GoogleAuthProvider,
    signInWithPopup,
  } from "firebase/auth";
  
  import { auth } from "../services/firebase";
  
  function Login() {
    const login = async () => {
      try {
        const provider =
          new GoogleAuthProvider();
  
        await signInWithPopup(
          auth,
          provider
        );
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="bg-gray-900 p-10 rounded-2xl border border-gray-800 w-96">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Survival OS
          </h1>
  
          <p className="text-gray-400 text-center mb-6">
            學生生存系統
          </p>
  
          <button
            onClick={login}
            className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-bold"
          >
            使用 Google 登入
          </button>
        </div>
      </div>
    );
  }
  
  export default Login;