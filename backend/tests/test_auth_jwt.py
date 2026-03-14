"""Unit tests for auth/jwt.py — no DB required."""
import os
import sys

# Ensure backend/ is on sys.path when running from the backend directory
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Override env vars before importing config
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://test:test@localhost/test")
os.environ.setdefault("JWT_SECRET", "test-secret-key-for-unit-tests")

import pytest
from auth.jwt import decode_token, encode_token


def test_encode_and_decode_roundtrip():
    token = encode_token(42)
    assert isinstance(token, str)
    user_id = decode_token(token)
    assert user_id == 42


def test_decode_invalid_token_raises():
    with pytest.raises(ValueError):
        decode_token("not.a.valid.token")


def test_decode_tampered_token_raises():
    token = encode_token(1)
    tampered = token[:-5] + "XXXXX"
    with pytest.raises(ValueError):
        decode_token(tampered)


def test_encode_preserves_different_ids():
    token_a = encode_token(1)
    token_b = encode_token(2)
    assert decode_token(token_a) == 1
    assert decode_token(token_b) == 2
    assert token_a != token_b
