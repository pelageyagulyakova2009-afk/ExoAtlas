"""Acquisition strategies. Formulas are manual (R2).

Houlsby et al. 2011, Bayesian Active Learning for Classification (BALD).
Sener & Savarese 2018, Active Learning for Convolutional Neural Networks: A Core-Set Approach.
"""

from abc import ABC, abstractmethod

import numpy as np


class AcquisitionStrategy(ABC):
    @abstractmethod
    def score(self, embeddings: np.ndarray, probs: np.ndarray) -> np.ndarray:
        """Higher score means label this object sooner."""


class EntropySampling(AcquisitionStrategy):
    def score(self, embeddings: np.ndarray, probs: np.ndarray) -> np.ndarray:
        # TODO(manual): H(y|x) = -sum p log p
        raise NotImplementedError("TODO(manual): entropy sampling")


class BALD(AcquisitionStrategy):
    def score(self, embeddings: np.ndarray, probs: np.ndarray) -> np.ndarray:
        # TODO(manual): mutual information across dropout samples (Houlsby 2011).
        raise NotImplementedError("TODO(manual): BALD")


class CoreSet(AcquisitionStrategy):
    def score(self, embeddings: np.ndarray, probs: np.ndarray) -> np.ndarray:
        # TODO(manual): k-center greedy (Sener & Savarese 2018).
        raise NotImplementedError("TODO(manual): core-set")


def strategy_factory(name: str) -> AcquisitionStrategy:
    mapping = {
        "entropy": EntropySampling,
        "bald": BALD,
        "core-set": CoreSet,
    }
    if name not in mapping:
        raise KeyError(name)
    return mapping[name]()
