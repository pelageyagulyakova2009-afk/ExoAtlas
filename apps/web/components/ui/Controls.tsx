'use client';

export function Section({
  title,
  children,
  onReset,
}: {
  title: string;
  children: React.ReactNode;
  onReset?: () => void;
}) {
  return (
    <details
      open
      className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg shadow-black/30"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
        {title}
        {onReset ? (
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-xs text-sky-300 hover:bg-white/10"
            onClick={(event) => {
              event.preventDefault();
              onReset();
            }}
          >
            Reset
          </button>
        ) : null}
      </summary>
      <div className="mt-3 space-y-3">{children}</div>
    </details>
  );
}

export function LabeledSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-xs text-slate-300">
      <span className="mb-1 flex justify-between">
        {label}
        <span className="tabular-nums text-slate-100">{value.toFixed(2)}</span>
      </span>
      <input
        className="w-full accent-[#4a9eff]"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
