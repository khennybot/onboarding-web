import type { Metadata } from "next";
import { IntakeForm } from "@/components/IntakeForm";

export const metadata: Metadata = {
  title: "Start onboarding",
  description:
    "Submit a client onboarding brief. It is stored and routed to the automation for welcome, kickoff and document collection.",
};

export default function OnboardPage() {
  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <span className="chip">Client intake</span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-900">
          Start a client onboarding
        </h1>
        <p className="mt-3 text-ink-500">
          Tell us about the project. The brief is saved and handed to the
          automation, which sends the welcome, schedules the kickoff and creates
          the shared folder.
        </p>
        <div className="mt-8">
          <IntakeForm />
        </div>
        <p className="mt-5 text-center text-xs text-ink-300">
          Your details are stored securely and used only to run this onboarding.
        </p>
      </div>
    </section>
  );
}
