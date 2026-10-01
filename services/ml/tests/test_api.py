import numpy as np
from fastapi.testclient import TestClient

from app.acquisition import BALD, CoreSet, EntropySampling
from app.head import LinearProbe
from app.main import app


def test_health_and_predict():
    client = TestClient(app)
    assert client.get("/health").json()["status"] == "ok"
    response = client.post("/predict", json={"embedding": [0.1] * 512})
    assert response.status_code == 200
    assert len(response.json()["probs"]) == 7


def test_next_batch_falls_back_while_strategies_are_manual():
    client = TestClient(app)
    response = client.post(
        "/next_batch",
        json={"strategy": "entropy", "embeddings": [[0.0, 1.0]], "probs": [[0.2, 0.8]]},
    )
    assert response.json()["status"] == "fallback-queue"


def test_strategies_are_not_implemented():
    probs = np.array([[0.5, 0.5]])
    emb = np.zeros((1, 4))
    for strategy in (EntropySampling(), BALD(), CoreSet()):
        try:
            strategy.score(emb, probs)
            raise AssertionError("expected NotImplementedError")
        except NotImplementedError:
            pass


def test_linear_probe_separates_two_classes():
    probe = LinearProbe(dim=2, classes=2)
    x = np.array([[0.0, 0.0], [0.0, 0.1], [1.0, 1.0], [1.0, 0.9]], dtype=np.float32)
    y = np.array([0, 0, 1, 1])
    probe.fit(x, y, steps=80, lr=0.5)
    pred = probe.predict_proba(x).argmax(axis=1)
    assert (pred == y).mean() == 1.0
