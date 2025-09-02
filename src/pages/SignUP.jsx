import { NavLink } from "react-router-dom";

export default function SignUp() {
  return (
    <main className="p-3 mt-20 flex flex-col justify-evenly gap-6 min-h-screen">
      <h3 className="justify-center text-[#ffa000] flex items-center font-medium text-4xl">
        Create Account
      </h3>

      <p className="justify-center flex text-gray-700 items-center">
        Kindly fill your information below
      </p>

      <div className="grid gap-4">
        {/* Name Field */}
        <div className="grid">
          <label className="text-gray-700 font-medium" htmlFor="name">
            Name
          </label>
          <input
            className="border p-2 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-green-600"
            type="text"
            id="name"
            placeholder="Kindly enter your full name"
          />
        </div>

        {/* Phone Field */}
        <div className="grid">
          <label className="text-gray-700 font-medium" htmlFor="number">
            Phone Number
          </label>
          <input
            className="border p-2 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-green-600"
            type="number"
            id="number"
            placeholder="Kindly enter your phone number"
          />
        </div>

        {/* Password Field */}
        <div className="grid">
          <label className="text-gray-700 font-medium" htmlFor="password">
            Password
          </label>
          <input
            className="border p-2 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-green-600"
            type="password"
            id="password"
            placeholder="**********"
          />
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-center gap-2">
        <input
          className="w-4 h-4 text-green-900 border-gray-600 rounded focus:ring-green-600"
          type="checkbox"
          id="terms"
        />
        <label htmlFor="terms">
          Agree with
          <a className="text-green-600 hover:underline ml-1" href="#">
            Terms & Conditions
          </a>
        </label>
      </div>

      {/* Submit Button */}
      <NavLink
        to="/vendorlist"
        className="justify-center flex bg-green-600 active:bg-amber-300 hover:bg-black transition duration-700 ease-in-out text-white p-3 rounded-2xl w-[90%] mx-auto"
      >
        Sign Up
      </NavLink>
    </main>
  );
}
