"""Image encoders. Inspired by mwalmsley/zoobot frozen-backbone heads (interface only)."""

from abc import ABC, abstractmethod

import numpy as np


class ImageEncoder(ABC):
    @abstractmethod
    def embed(self, image: np.ndarray) -> np.ndarray:
        """Return a single embedding vector."""

    @property
    @abstractmethod
    def dim(self) -> int:
        """Embedding width."""


class CLIPEncoder(ImageEncoder):
    """Open CLIP ViT-B/32. Weights load on first embed when open_clip is installed."""

    def __init__(self) -> None:
        self._model = None
        self._preprocess = None

    @property
    def dim(self) -> int:
        return 512

    def embed(self, image: np.ndarray) -> np.ndarray:
        model, preprocess = self._load()
        import torch
        from PIL import Image

        pil = Image.fromarray(image.astype("uint8"))
        batch = preprocess(pil).unsqueeze(0)
        device = "mps" if torch.backends.mps.is_available() else "cpu"
        batch = batch.to(device)
        with torch.no_grad():
            vector = model.encode_image(batch)
            vector = vector / vector.norm(dim=-1, keepdim=True)
        return vector.squeeze(0).detach().cpu().numpy().astype(np.float32)

    def _load(self):
        if self._model is not None:
            return self._model, self._preprocess
        import open_clip
        import torch

        device = "mps" if torch.backends.mps.is_available() else "cpu"
        model, _, preprocess = open_clip.create_model_and_transforms(
            "ViT-B-32", pretrained="laion2b_s34b_b79k", device=device
        )
        model.eval()
        self._model = model
        self._preprocess = preprocess
        return model, preprocess


class DINOv2Encoder(ImageEncoder):
    """Scaffold. TODO(manual): load facebook/dinov2-small and match embed()."""

    @property
    def dim(self) -> int:
        return 384

    def embed(self, image: np.ndarray) -> np.ndarray:
        raise NotImplementedError("TODO(manual): DINOv2-small forward pass")
