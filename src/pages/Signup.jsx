// src/components/Signup.js
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast/ToastMassege";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input-1";
import { cn } from "../lib/utils";
import PropTypes from "prop-types";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save additional user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
      });

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/"); // Navigate to home page
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="shadow-input mx-auto rounded-none p-4 md:rounded-2xl md:p-8 max-w-xl w-full bg-slate-200 dark:bg-slate-800">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-white text-center">
          Welcome to Vedic Flora
        </h2>
        <p className="mt-2 text-base text-neutral-600 dark:text-neutral-100 text-center">
          Join us today and explore our power of Ayurvedic herbal plants 
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="my-8" onSubmit={handleSignup}>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="fullname">Full name</Label>
              <Input
                id="fullname"
                placeholder="Tyler"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-gray-100 dark:bg-gray-800"
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="example_1@vedic.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-100 dark:bg-gray-800"
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-100 dark:bg-gray-800"
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="password">Confirm password</Label>
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-gray-100 dark:bg-gray-800"
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-teal-700 to-teal-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-teal-800 dark:from-teal-700 dark:to-teal-600 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
      {showToast && (
        <Toast
          message="User signed up successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

LabelInputContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Signup;
