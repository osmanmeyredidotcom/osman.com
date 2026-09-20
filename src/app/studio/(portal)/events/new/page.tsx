import { EventForm } from "@/components/studio/EventForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Add a show" };

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialType = params.type === "FREE_GIG" ? "FREE_GIG" : "TICKETED_CONCERT";

  return (
    <div>
      <PageHeader
        title="Add a show"
        intro="Fill in the essentials. You can always save as a draft and finish later."
      />
      <EventForm initialType={initialType} />
    </div>
  );
}
