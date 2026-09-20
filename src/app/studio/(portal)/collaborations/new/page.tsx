import { CollaborationForm } from "@/components/studio/CollaborationForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Add collaboration" };

export default function NewCollaborationPage() {
  return (
    <div>
      <PageHeader
        title="Add collaboration"
        intro="Stick to verified facts. Photos and cultural notes stay off the site until their checks are confirmed."
      />
      <CollaborationForm />
    </div>
  );
}
