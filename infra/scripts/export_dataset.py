"""Write labels to a parquet file for a later Hugging Face Datasets upload."""

import json
from pathlib import Path

import numpy as np


def rows_to_parquet(rows: list[dict], path: Path) -> None:
    try:
        import pyarrow as pa
        import pyarrow.parquet as pq
    except ImportError as exc:
        raise SystemExit("pip install pyarrow") from exc
    table = pa.Table.from_pylist(rows)
    pq.write_table(table, path)


if __name__ == "__main__":
    sample = [{"object_id": "obj-1", "tags": ["clouds"], "confidence": 0.8}]
    out = Path("experiments/labels.parquet")
    rows_to_parquet(sample, out)
    print(json.dumps({"rows": len(sample), "bytes": out.stat().st_size, "dtype": str(np.float32)}))
