import importlib.util
from pathlib import Path

path = Path(__file__).resolve().parents[3] / "infra" / "scripts" / "reward.py"
spec = importlib.util.spec_from_file_location("reward", path)
reward = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(reward)


def test_rare_tag_threshold():
    tags = ["clouds"] * 20 + ["rings"]
    assert reward.rare_tags(tags) == ["rings"]
    assert "clouds" not in reward.rare_tags(tags)


def test_seed_bias_is_deterministic():
    rows = reward.seeds_for(["rings", "spiral"])
    assert rows[0]["type"] == "planet"
    assert rows[0]["params"]["seaLevel"] == 0.2
    assert rows[1]["type"] == "galaxy"
