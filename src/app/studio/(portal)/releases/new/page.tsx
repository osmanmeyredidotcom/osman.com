import { getRepos } from "@/server/repositories";
import { ReleaseForm } from "@/components/studio/ReleaseForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Add release" };

export default async function NewReleasePage() {
  const collaborations = await getRepos().collaborations.list();
  return (
    <div>
      <PageHeader
        title="Add release"
        intro="Start with the relationship to Osman. It decides how the release is billed."
      />
      <ReleaseForm collaborations={collaborations} />
    </div>
  );
}
