from typing import AsyncGenerator

import strawberry
from sqlalchemy import select
from strawberry.types import Info

from gql.pubsub import publish, subscribe
from gql.types.message import MessageType
from models.message import Message


def _to_type(msg: Message) -> MessageType:
    return MessageType(
        id=strawberry.ID(str(msg.id)),
        content=msg.content,
        user_id=msg.user_id,
        created_at=msg.created_at,
    )


@strawberry.type
class MessageQuery:
    @strawberry.field
    async def messages(self, info: Info) -> list[MessageType]:
        ctx = info.context
        if ctx["user"] is None:
            raise Exception("Authentication required")
        db = ctx["db"]
        result = await db.execute(select(Message).order_by(Message.created_at.desc()).limit(50))
        return [_to_type(m) for m in result.scalars().all()]


@strawberry.type
class MessageMutation:
    @strawberry.mutation
    async def create_message(self, info: Info, content: str) -> MessageType:
        ctx = info.context
        user = ctx["user"]
        if user is None:
            raise Exception("Authentication required")
        db = ctx["db"]
        msg = Message(content=content, user_id=user.id)
        db.add(msg)
        await db.commit()
        await db.refresh(msg)
        message_type = _to_type(msg)
        await publish(message_type)
        return message_type


@strawberry.type
class MessageSubscription:
    @strawberry.subscription
    async def message_added(self, info: Info) -> AsyncGenerator[MessageType, None]:
        async with subscribe() as queue:
            while True:
                message = await queue.get()
                yield message
