import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  // If not onboarded, redirect to onboarding page
  // Skip this check if already on the onboarding page
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  try {
    const insights = await getIndustryInsights();
    if (!insights) {
      throw new Error("No industry insights available");
    }

    return (
      <div className="container mx-auto">
        <DashboardView insights={insights} />
      </div>
    );
  } catch (error) {
    if (error.message === "Please complete your industry selection in onboarding") {
      redirect("/onboarding");
    }

    // For other errors, show an error state
    return (
      <div className="container mx-auto mt-8 p-4">
        <div className="bg-destructive/15 text-destructive p-4 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-2">Unable to load industry insights</h2>
          <p>{error.message || "Please try again later."}</p>
        </div>
      </div>
    );
  }
}
