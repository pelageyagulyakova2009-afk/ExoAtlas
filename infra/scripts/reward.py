"""Rare tags bias the next generated seeds.

A tag is rare when its share of all tag assignments is under 5%.
The script emits seeds whose parameter JSON raises the matching control.
It does not implement noise math.
"""

from __future__ import annotations

import json
from collections import Counter

RARITY = 0.05

TAG_BIAS = {
    "rings": {"seaLevel": 0.2},
    "atmosphere": {"atmosphereDensity": 1.2},
    "clouds": {"cloudCoverage": 0.9, "moisture": 0.85},
    "spiral": {"arms": 4, "pitchAngle": 0.22},
    "bar": {"coreSize": 0.35},
    "elliptical": {"arms": 0, "pitchAngle": 0.9},
    "dust_lane": {"dustDensity": 0.95},
}


def rare_tags(assignments: list[str]) -> list[str]:
    if not assignments:
        return []
    counts = Counter(assignments)
    total = sum(counts.values())
    return [tag for tag, count in counts.items() if count / total < RARITY]


def seeds_for(tags: list[str], start: int = 10_000) -> list[dict]:
    rows = []
    for index, tag in enumerate(tags):
        kind = "galaxy" if tag in {"spiral", "bar", "elliptical", "dust_lane"} else "planet"
        rows.append(
            {
                "seed": start + index,
                "type": kind,
                "params": {"seed": start + index, **TAG_BIAS.get(tag, {})},
                "reason": tag,
            }
        )
    return rows


if __name__ == "__main__":
    sample = ["clouds"] * 50 + ["rings"]
    print(json.dumps(seeds_for(rare_tags(sample)), indent=2))
