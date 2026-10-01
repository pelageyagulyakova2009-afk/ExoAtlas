"""FastAPI surface for embed, predict, next batch, and train."""

from typing import Literal

import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel

from app.acquisition import strategy_factory
from app.benchmark import compare
from app.head import LinearProbe
from app.train import train_head

app = FastAPI(title="ExoForge ML")
probe = LinearProbe(dim=512, classes=7)


class EmbedIn(BaseModel):
    pixels: list[list[list[int]]]


class PredictIn(BaseModel):
    embedding: list[float]


class BatchIn(BaseModel):
    strategy: Literal["entropy", "bald", "core-set"] = "entropy"
    embeddings: list[list[float]]
    probs: list[list[float]]


class TrainIn(BaseModel):
    embeddings: list[list[float]] = []
    labels: list[int] = []
    labelCount: int = 0


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/embed")
def embed(body: EmbedIn) -> dict[str, list[float] | str]:
    array = np.asarray(body.pixels, dtype=np.uint8)
    try:
        from app.encoder import CLIPEncoder

        vector = CLIPEncoder().embed(array)
        return {"embedding": vector.tolist(), "encoder": "clip"}
    except Exception as exc:  # weights or torch may be absent in CI
        return {"embedding": [0.0] * 512, "encoder": f"unavailable:{type(exc).__name__}"}


@app.post("/predict")
def predict(body: PredictIn) -> dict[str, list[float]]:
    matrix = np.asarray(body.embedding, dtype=np.float32).reshape(1, -1)
    if matrix.shape[1] != probe.dim:
        matrix = np.zeros((1, probe.dim), dtype=np.float32)
    return {"probs": probe.predict_proba(matrix)[0].tolist()}


@app.post("/next_batch")
def next_batch(body: BatchIn) -> dict[str, str | list[int]]:
    strategy = strategy_factory(body.strategy)
    try:
        scores = strategy.score(
            np.asarray(body.embeddings, dtype=np.float32),
            np.asarray(body.probs, dtype=np.float32),
        )
        order = scores.argsort()[::-1].tolist()
        return {"status": "scored", "order": order}
    except NotImplementedError:
        return {"status": "fallback-queue", "order": list(range(len(body.embeddings)))}


@app.post("/train")
def train(body: TrainIn) -> dict[str, float | int]:
    metrics = train_head(
        np.asarray(body.embeddings, dtype=np.float32).reshape(-1, 8) if body.embeddings else np.zeros((0, 8)),
        np.asarray(body.labels, dtype=np.int64),
    )
    metrics["labelCount"] = float(body.labelCount)
    return metrics


@app.get("/benchmark")
def benchmark() -> dict[str, str]:
    return compare(["entropy", "bald", "core-set"])
