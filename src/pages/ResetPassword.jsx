import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const phone = sessionStorage.getItem("fp_phone");
  useEffect(() => {
    if (!phone) navigate("/forgot", { replace: true });
  }, [phone, navigate]);

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const valid = pw.length >= 6 && pw === pw2;

  const handleReset = (e) => {
    e.preventDefault();
    if (!valid) return;

    // Mock “save” password (replace with your backend)
    localStorage.setItem(`user:${phone}:password`, pw);

    // Clear the flow state
    sessionStorage.removeItem("fp_phone");
    sessionStorage.removeItem("fp_code");
    sessionStorage.removeItem("fp_expires");
    sessionStorage.removeItem("fp_attempts");

    alert("Password updated. Please sign in.");
    navigate("/signin", { replace: true });
  };

  return (
    <main className="min-h-screen grid place-items-center bg-[#637865]">
      <div className="w-[22rem] max-w-[90vw] bg-white rounded-2xl p-6 shadow-xl">
        <img src="/yov.png" alt="GetYovo" className="w-20 mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-[#1b5e20] text-center">Set new password</h1>
        <p className="text-center text-sm text-gray-500 mb-4">Use a strong password</p>

        <form onSubmit={handleReset} className="space-y-3">
          <div className="grid gap-1">
            <label className="text-sm text-gray-700" htmlFor="pw">New password</label>
            <input
              id="pw"
              className="w-full p-3 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-[#1b5e20]/30"
              type="password"
              placeholder="********"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm text-gray-700" htmlFor="pw2">Confirm password</label>
            <input
              id="pw2"
              className="w-full p-3 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-[#1b5e20]/30"
              type="password"
              placeholder="********"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              autoComplete="new-password"
            />
            {pw2.length > 0 && !valid && (
              <span className="text-xs text-red-600">Passwords must match and be at least 6 characters</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!valid}
            className={`w-full p-3 rounded-xl font-semibold text-white transition
                        ${valid ? "bg-[#1b5e20] hover:bg-[#388e3c]" : "bg-gray-300 cursor-not-allowed"}`}
          >
            Save password
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Remembered it?{" "}
          <Link to="/signin" className="text-[#1b5e20] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
