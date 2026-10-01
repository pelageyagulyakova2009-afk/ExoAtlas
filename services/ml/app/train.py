"""Head update every N labels. Does not touch the frozen encoder."""

import numpy as np

from app.head import LinearProbe

PROBE = LinearProbe(dim=8, classes=2)


def train_head(embeddings: np.ndarray, labels: np.ndarray) -> dict[str, float]:
    PROBE.fit(embeddings, labels)
    if len(embeddings) == 0:
        return {"f1": 0.0}
    probs = PROBE.predict_proba(embeddings)
    pred = probs.argmax(axis=1)
    tp = int(((pred == 1) & (labels == 1)).sum())
    fp = int(((pred == 1) & (labels == 0)).sum())
    fn = int(((pred == 0) & (labels == 1)).sum())
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    f1 = 0.0 if precision + recall == 0 else 2 * precision * recall / (precision + recall)
    return {"f1": float(f1), "precision": float(precision), "recall": float(recall)}
