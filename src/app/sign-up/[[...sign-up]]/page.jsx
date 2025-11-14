import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
        {/* Left section */}
        <section className="space-y-4">
          <p className="text-[0.7rem] tracking-[0.3em] uppercase">
            Create your account
          </p>

          <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
            Start refining your data
          </h1>

          <p className="text-sm md:text-base  max-w-md">
            Sign up to create projects, upload datasets, and build versioned
            refinement flows that you can reuse every time new data arrives.
          </p>
        </section>

        {/* Clerk Sign-Up */}
        <section className="flex justify-center lg:justify-end">
          <SignUp
            appearance={{
              elements: {
                card:
                  "bg-slate-900/95 border border-slate-700 shadow-xl shadow-black/40",

                /* Titles + labels → sky-300/80 */
                headerTitle: "text-sky-300/80 text-lg font-semibold",
                headerSubtitle: "text-sky-300/80 text-xs",
                formFieldLabel: "text-sky-300/80 text-sm font-medium",

                /* Inputs */
                formFieldInput:
                  "bg-slate-800 border border-slate-600 text-slate-100 placeholder:text-slate-500",

                /* Primary button */
                formButtonPrimary:
                  "bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-lg shadow-md shadow-sky-500/30",

                /* Social login buttons */
                socialButtonsBlockButton:
                  "bg-slate-800 border border-slate-600 text-slate-200 hover:bg-slate-700",

                /* Footer text + link */
                footerActionText: "text-sky-300/80 text-xs",
                footerActionLink:
                  "text-sky-300/80 hover:text-sky-200 text-xs font-medium",
              },
              variables: {
                colorPrimary: "#38bdf8",
                colorText: "#1e293b",
                colorBackground: "#e5e7eb",
                borderRadius: "0.75rem",
              },
            }}
          />
        </section>
      </div>
    </main>
  );
}
