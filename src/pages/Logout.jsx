// src/components/Logout.js
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Logout = () => {
  const handleLogout = async () => {
    await signOut(auth);
    alert("User signed out successfully!");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
