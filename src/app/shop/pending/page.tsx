import Link from "next/link";
import { Clock3, ShieldCheck, Home } from "lucide-react";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-6">

      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-green-100 p-10">

        {/* Icon */}

        <div className="w-24 h-24 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
          <Clock3 className="w-12 h-12 text-orange-500" />
        </div>

        {/* Title */}

        <h1 className="text-4xl font-black text-center mt-8">
          Shop Submitted Successfully 🎉
        </h1>

        <p className="text-center text-gray-600 mt-4 text-lg">
          Your shop registration has been received successfully.
        </p>

        <p className="text-center text-gray-500 mt-2">
          Our Super Admin will verify your shop details before activation.
        </p>

        {/* Status Card */}

        <div className="mt-10 rounded-3xl bg-orange-50 border border-orange-200 p-6">

          <div className="flex items-center gap-3">

            <ShieldCheck className="text-orange-500" />

            <h2 className="font-bold text-xl">
              Verification Status
            </h2>

          </div>

          <div className="mt-6 space-y-3 text-gray-700">

            <div className="flex justify-between">
              <span>Application Status</span>
              <span className="font-semibold text-orange-600">
                Pending Approval
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Review Time</span>
              <span className="font-semibold">
                Within 24 Hours
              </span>
            </div>

            <div className="flex justify-between">
              <span>Current Access</span>
              <span className="font-semibold text-red-500">
                Dashboard Locked
              </span>
            </div>

          </div>

        </div>

        {/* Information */}

        <div className="mt-8 rounded-2xl bg-green-50 border border-green-200 p-5">

          <h3 className="font-bold text-green-700 mb-3">
            What happens next?
          </h3>

          <ul className="space-y-2 text-gray-700 list-disc pl-5">

            <li>Our admin will verify your shop information.</li>

            <li>Your documents and address will be reviewed.</li>

            <li>After approval, your shop will become visible to customers.</li>

            <li>You will then be able to manage products and orders.</li>

          </ul>

        </div>

        {/* Buttons */}

        <div className="mt-10 flex flex-col md:flex-row gap-4">

          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold py-4 transition"
          >
            <Home size={20} />
            Back to Home
          </Link>

          <button
            disabled
            className="flex-1 rounded-2xl bg-gray-200 text-gray-500 font-bold py-4 cursor-not-allowed"
          >
            Waiting for Approval...
          </button>

        </div>

      </div>

    </div>
  );
}