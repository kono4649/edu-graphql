"""Unit tests for progress resolver topic validation."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://test:test@localhost/test")
os.environ.setdefault("JWT_SECRET", "test-secret-key-for-unit-tests")

from gql.resolvers.progress import VALID_TOPICS


def test_valid_topics_contains_expected():
    assert "query" in VALID_TOPICS
    assert "mutation" in VALID_TOPICS
    assert "subscription" in VALID_TOPICS


def test_valid_topics_rejects_unknown():
    assert "unknown_topic" not in VALID_TOPICS
    assert "" not in VALID_TOPICS
