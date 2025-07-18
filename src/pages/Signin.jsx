// src/components/Signin.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast/ToastMassege";
import { FiMail, FiLock } from "react-icons/fi";
// import { FcGoogle } from "react-icons/fc";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Signin = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Use login function from context
      await login(email, password);
      
      // Show success toast and navigate
      setShowToast(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      // More comprehensive error handling
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError("Invalid email or password");
          break;
        case 'auth/too-many-requests':
          setError("Too many failed login attempts. Please try again later.");
          break;
        case 'auth/user-disabled':
          setError("This account has been disabled.");
          break;
        case 'auth/invalid-email':
          setError("Invalid email format.");
          break;
        default:
          setError("An error occurred during sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign-in handler (commented out, but ready to use)
  // const handleGoogleSignIn = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     await signInWithPopup(auth, provider);
  //     setShowToast(true);
  //     setTimeout(() => {
  //       navigate("/");
  //     }, 1500);
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full rounded-xl space-y-8 p-4 bg-slate-200 dark:bg-slate-800">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please sign in to your account
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignin} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="z-30" size={20} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="z-30" size={20} />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
          
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>
          
          {/* Uncomment for Google Sign-In */}
          {/* <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
            >
              <FcGoogle className="mr-2" size={20} />
              Sign in with Google
            </button>
          </div> */}

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don&#39;t have an account?{" "}
              <Link to="/signup" className="font-medium text-teal-600 hover:text-teal-500">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
      {showToast && <Toast message="User signed in successfully!" onClose={() => setShowToast(false)} />}
    </div>
  );
};

export default Signin;
