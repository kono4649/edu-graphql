import asyncio
from contextlib import asynccontextmanager
from typing import AsyncGenerator

_subscribers: list[asyncio.Queue] = []


@asynccontextmanager
async def subscribe() -> AsyncGenerator[asyncio.Queue, None]:
    """Async context manager that registers/unregisters a subscriber queue.

    Usage:
        async with subscribe() as queue:
            message = await queue.get()
    """
    q: asyncio.Queue = asyncio.Queue()
    _subscribers.append(q)
    try:
        yield q
    finally:
        _subscribers.remove(q)


async def publish(message: object) -> None:
    """Broadcast a message to all current subscribers."""
    for q in _subscribers:
        await q.put(message)
