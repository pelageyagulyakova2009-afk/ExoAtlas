const TRAIN_EVERY = 32;

export function shouldTrain(labelCount: number): boolean {
  return labelCount > 0 && labelCount % TRAIN_EVERY === 0;
}

export async function requestTrain(
  labelCount: number,
): Promise<{ trained: boolean; detail: string }> {
  if (!shouldTrain(labelCount))
    return { trained: false, detail: 'threshold not met' };
  const base = process.env.ML_SERVICE_URL;
  if (!base) return { trained: false, detail: 'ML_SERVICE_URL unset' };
  const response = await fetch(`${base}/train`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ labelCount }),
  });
  if (!response.ok) return { trained: false, detail: `ml ${response.status}` };
  return { trained: true, detail: 'ok' };
}
