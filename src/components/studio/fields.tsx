import type { ReactNode } from "react";

/**
 * Small shared form primitives for the studio. Plain, calm, single-column.
 * All inputs are uncontrolled unless a form needs live behaviour (radio tiles,
 * platform auto-detect) — progressive enhancement stays intact.
 */

export const inputClass =
  "w-full rounded-md border border-line-dark bg-canvas px-3 py-2 text-[15px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none";

export const primaryButtonClass =
  "inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-canvas transition-colors hover:bg-accent-strong disabled:opacity-60";

export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-md border border-line bg-transparent px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink-faint";

export const subtleButtonClass =
  "text-xs font-medium text-ink-soft underline-offset-2 hover:text-accent hover:underline";

export function describedBy(
  name: string,
  help?: string,
  errors?: string[]
): string | undefined {
  const parts: string[] = [];
  if (help) parts.push(`${name}-help`);
  if (errors && errors.length > 0) parts.push(`${name}-error`);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

export function FieldError({ name, errors }: { name: string; errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p id={`${name}-error`} role="alert" className="text-[13px] font-medium text-danger">
      {errors[0]}
    </p>
  );
}

export function Help({ name, children }: { name: string; children: ReactNode }) {
  return (
    <p id={`${name}-help`} className="text-xs leading-relaxed text-ink-faint">
      {children}
    </p>
  );
}

export function Label({
  htmlFor,
  optional,
  children,
}: {
  htmlFor: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
      {children}
      {optional ? (
        <span className="ml-1.5 text-xs font-normal text-ink-faint">optional</span>
      ) : null}
    </label>
  );
}

interface CommonFieldProps {
  label: string;
  name: string;
  help?: string;
  errors?: string[];
  optional?: boolean;
}

function FieldShell({
  label,
  name,
  help,
  errors,
  optional,
  children,
}: CommonFieldProps & { children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} optional={optional}>
        {label}
      </Label>
      {children}
      {help ? <Help name={name}>{help}</Help> : null}
      <FieldError name={name} errors={errors} />
    </div>
  );
}

export function TextField(
  props: CommonFieldProps & {
    type?: string;
    defaultValue?: string;
    placeholder?: string;
    autoComplete?: string;
    required?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
  }
) {
  const { label, name, help, errors, optional, type = "text", defaultValue, placeholder, autoComplete, required, onChange } = props;
  return (
    <FieldShell label={label} name={name} help={help} errors={errors} optional={optional}>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        onChange={onChange}
        aria-invalid={errors && errors.length > 0 ? true : undefined}
        aria-describedby={describedBy(name, help, errors)}
        className={inputClass}
      />
    </FieldShell>
  );
}

export function TextareaField(
  props: CommonFieldProps & { defaultValue?: string; rows?: number; placeholder?: string }
) {
  const { label, name, help, errors, optional, defaultValue, rows = 4, placeholder } = props;
  return (
    <FieldShell label={label} name={name} help={help} errors={errors} optional={optional}>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={errors && errors.length > 0 ? true : undefined}
        aria-describedby={describedBy(name, help, errors)}
        className={`${inputClass} leading-relaxed`}
      />
    </FieldShell>
  );
}

export function SelectField(
  props: CommonFieldProps & {
    options: Array<{ value: string; label: string }>;
    defaultValue?: string;
  }
) {
  const { label, name, help, errors, optional, options, defaultValue } = props;
  return (
    <FieldShell label={label} name={name} help={help} errors={errors} optional={optional}>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={errors && errors.length > 0 ? true : undefined}
        aria-describedby={describedBy(name, help, errors)}
        className={inputClass}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({
  label,
  name,
  help,
  defaultChecked,
}: {
  label: string;
  name: string;
  help?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label htmlFor={name} className="flex cursor-pointer items-start gap-2.5">
      <input
        id={name}
        name={name}
        type="checkbox"
        value="true"
        defaultChecked={defaultChecked}
        aria-describedby={help ? `${name}-help` : undefined}
        className="mt-0.5 h-4 w-4 accent-(--color-accent)"
      />
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {help ? (
          <span id={`${name}-help`} className="block text-xs text-ink-faint">
            {help}
          </span>
        ) : null}
      </span>
    </label>
  );
}

/** Form-level messages (errors under the "_form" key). */
export function FormError({ errors }: { errors?: Record<string, string[]> }) {
  const messages = errors?._form;
  if (!messages || messages.length === 0) return null;
  return (
    <div
      role="alert"
      className="rounded-md border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger"
    >
      {messages.map((m) => (
        <p key={m}>{m}</p>
      ))}
    </div>
  );
}

/** "Saved" confirmation for forms that stay on the page (settings, services). */
export function SavedNotice({ show, message }: { show?: boolean; message?: string }) {
  if (!show) return null;
  return (
    <div
      role="status"
      className="rounded-md border border-ok/40 bg-ok/5 px-4 py-3 text-sm text-ok"
    >
      {message ?? "Saved. The site has been updated."}
    </div>
  );
}

/** The standard footer for draft/publish forms. */
export function PublishButtons({ isPublished }: { isPublished?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
      <button type="submit" name="intent" value="publish" className={primaryButtonClass}>
        {isPublished ? "Save and publish" : "Publish now"}
      </button>
      <button type="submit" name="intent" value="draft" className={secondaryButtonClass}>
        Save as draft
      </button>
    </div>
  );
}
