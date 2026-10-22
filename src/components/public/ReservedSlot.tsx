/**
 * Reserved media slot — 12-10 feedback round.
 *
 * A quiet, honestly-labelled 16:9 position for a video that is confirmed but
 * whose file has not been supplied yet (VIDEOS.md: the two show-application
 * performance videos, DEP-05; LIVE_PIANO.md: the pending piano video with the
 * exact label "Coming soon" per P12-X257). Never a broken thumbnail, never
 * invented content — the slot disappears the moment the real video is
 * published in its place.
 */
export function ReservedSlot({ label = "Coming soon" }: { label?: string }) {
  return (
    <div className="reserved-slot" role="note" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}
