"""Harness that records strategy scores once the formulas exist."""

from app.acquisition import strategy_factory


def compare(names: list[str]) -> dict[str, str]:
    report = {}
    for name in names:
        strategy = strategy_factory(name)
        report[name] = strategy.__class__.__name__
    return report
