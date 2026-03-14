"""Unit tests for gql/pubsub.py."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://test:test@localhost/test")
os.environ.setdefault("JWT_SECRET", "test-secret-key-for-unit-tests")

import asyncio
import pytest
from gql.pubsub import publish, subscribe, _subscribers


@pytest.mark.asyncio
async def test_subscribe_receives_published_message():
    received = []

    async def consumer():
        async with subscribe() as queue:
            msg = await asyncio.wait_for(queue.get(), timeout=1.0)
            received.append(msg)

    task = asyncio.create_task(consumer())
    # Give consumer time to register
    await asyncio.sleep(0.01)
    await publish("hello")
    await task

    assert received == ["hello"]


@pytest.mark.asyncio
async def test_subscriber_removed_after_exit():
    initial_count = len(_subscribers)

    async def consumer():
        async with subscribe() as _queue:
            pass  # immediately exit

    await consumer()
    assert len(_subscribers) == initial_count


@pytest.mark.asyncio
async def test_multiple_subscribers_all_receive():
    results: dict[str, list] = {"a": [], "b": []}

    async def consumer(key: str):
        async with subscribe() as queue:
            msg = await asyncio.wait_for(queue.get(), timeout=1.0)
            results[key].append(msg)

    task_a = asyncio.create_task(consumer("a"))
    task_b = asyncio.create_task(consumer("b"))
    await asyncio.sleep(0.01)
    await publish("broadcast")
    await asyncio.gather(task_a, task_b)

    assert results["a"] == ["broadcast"]
    assert results["b"] == ["broadcast"]
