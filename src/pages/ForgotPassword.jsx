import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import Toast from "../components/Toast/ToastMassege";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent successfully!");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full rounded-xl space-y-8 p-4 bg-slate-200 dark:bg-slate-800">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email to reset your password
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 dark:bg-green-900/30 text-green-500 p-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
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

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
            >
              Send Reset Link
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Link to="/signin" className="font-medium text-teal-600 hover:text-teal-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
      {showToast && <Toast message={message} onClose={() => setShowToast(false)} />}
    </div>
  );
};

export default ForgotPassword;