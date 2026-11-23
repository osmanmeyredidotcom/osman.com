/**
 * Small inline forms for list-row actions (Duplicate, Archive, Unpublish,
 * and since 19-11 Move up / Move down on Live videos).
 * Plain server-rendered forms — they work without JavaScript.
 */
export function RowAction({
  action,
  id,
  label,
  fields,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label: string;
  /** Extra hidden fields, e.g. the direction of a move. */
  fields?: Record<string, string>;
}) {
  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      {fields &&
        Object.entries(fields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      <button
        type="submit"
        className="text-xs font-medium text-ink-soft underline-offset-2 hover:text-accent hover:underline"
      >
        {label}
      </button>
    </form>
  );
}
