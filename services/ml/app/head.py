"""Linear probe on frozen embeddings."""

import numpy as np


class LinearProbe:
    def __init__(self, dim: int, classes: int) -> None:
        self.dim = dim
        self.classes = classes
        self.weights = np.zeros((classes, dim), dtype=np.float32)
        self.bias = np.zeros((classes,), dtype=np.float32)

    def predict_proba(self, embeddings: np.ndarray) -> np.ndarray:
        logits = embeddings @ self.weights.T + self.bias
        logits = logits - logits.max(axis=1, keepdims=True)
        exp = np.exp(logits)
        return exp / exp.sum(axis=1, keepdims=True)

    def fit(self, embeddings: np.ndarray, labels: np.ndarray, steps: int = 40, lr: float = 0.2) -> None:
        if len(embeddings) == 0:
            return
        for _ in range(steps):
            probs = self.predict_proba(embeddings)
            one_hot = np.zeros_like(probs)
            one_hot[np.arange(len(labels)), labels] = 1.0
            grad = (probs - one_hot) / len(labels)
            self.weights -= lr * (grad.T @ embeddings)
            self.bias -= lr * grad.sum(axis=0)
