"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ComputeResult, ToolField } from "@/shared";
import { NumberFieldShell, ResultRows } from "@/shared";
import { trackCalculatorResult, trackCalculatorStart } from "@/lib/analytics";
import { computeMap } from "@/lib/compute-map";

export default function AppCalculator({
  slug,
  fields,
}: {
  slug: string;
  fields: ToolField[];
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.default != null ? String(f.default) : ""])),
  );
  const hasStarted = useRef(false);
  const hasTrackedResult = useRef(false);

  const result: ComputeResult | null = useMemo(() => {
    const nums: Record<string, number> = {};
    for (const f of fields) {
      const raw = values[f.name];
      if (raw === undefined || raw === "") return null;
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0) return null;
      nums[f.name] = n;
    }
    const compute = computeMap[slug];
    if (!compute) return null;
    try {
      return compute(nums);
    } catch {
      return null;
    }
  }, [values, fields, slug]);

  useEffect(() => {
    if (result && hasStarted.current && !hasTrackedResult.current) {
      hasTrackedResult.current = true;
      trackCalculatorResult(slug);
    }
  }, [result, slug]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <NumberFieldShell
            key={f.name}
            label={f.label}
            unit={f.unit}
            help={f.help}
            min={f.min}
            max={f.max}
            step={f.step}
            value={values[f.name] ?? ""}
            onInput={(v) => {
              if (!hasStarted.current) {
                hasStarted.current = true;
                trackCalculatorStart(slug);
              }
              setValues((s) => ({ ...s, [f.name]: v }));
            }}
          />
        ))}
      </div>
      <div className="mt-6 border-t border-stone-200 pt-4">
        {result ? (
          <ResultRows rows={result.rows} note={result.note} />
        ) : (
          <p className="text-sm text-stone-400">
            Enter your measurements above to see results.
          </p>
        )}
      </div>
    </div>
  );
}
