import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
        {/* Left: copy / context */}
        <section className="space-y-4">
          <p className="text-[0.7rem] tracking-[0.3em] uppercase text-sky-300/80">
            Welcome back
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
            Continue where you left off
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
              with your refinement projects.
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-md">
            Sign in to access your projects, datasets, and versioned pipelines.
            DataRefine keeps the full history of how your data was cleaned,
            so you can confidently rerun and reuse the same flows.
          </p>
          <p className="text-xs md:text-sm text-slate-400 max-w-sm">
            If you’re working with a new dataset, you can create a fresh project
            right after signing in — your rules and transformations will stay
            organized by project.
          </p>
        </section>

        {/* Right: Clerk SignIn */}
        <section className="flex justify-center lg:justify-end">
          <SignIn
            appearance={{
              elements: {
                card:
                  "bg-slate-950/90 border border-slate-800 shadow-xl shadow-black/40",
                headerTitle: "text-slate-100 text-lg font-semibold",
                headerSubtitle: "text-slate-400 text-xs",
                formButtonPrimary:
                  "bg-sky-500 hover:bg-sky-400 text-sm font-medium text-white rounded-xl shadow-md shadow-sky-500/30",
                formFieldLabel: "text-slate-200 text-xs font-medium",
                formFieldInput:
                  "bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500",
                socialButtonsBlockButton:
                  "bg-slate-900 border border-slate-700 text-slate-100 hover:bg-slate-800",
                footerActionText: "text-slate-400 text-xs",
                footerActionLink:
                  "text-sky-400 hover:text-sky-300 text-xs font-medium",
              },
              variables: {
                colorPrimary: "#38bdf8", 
                colorText: "#020617", 
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
