import strawberry
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from strawberry.types import Info

from gql.types.progress import ProgressType
from models.progress import UserProgress

VALID_TOPICS = {"query", "mutation", "subscription"}


def _to_type(p: UserProgress) -> ProgressType:
    return ProgressType(id=strawberry.ID(str(p.id)), topic=p.topic, completed_at=p.completed_at)


class ProgressQuery:
    @strawberry.field
    async def my_progress(self, info: Info) -> list[ProgressType]:
        ctx = info.context
        user = ctx["user"]
        if user is None:
            raise Exception("Authentication required")
        db = ctx["db"]
        result = await db.execute(
            select(UserProgress).where(UserProgress.user_id == user.id)
        )
        return [_to_type(p) for p in result.scalars().all()]


class ProgressMutation:
    @strawberry.mutation
    async def mark_topic_complete(self, info: Info, topic: str) -> ProgressType:
        ctx = info.context
        user = ctx["user"]
        if user is None:
            raise Exception("Authentication required")
        if topic not in VALID_TOPICS:
            raise Exception(f"Invalid topic. Must be one of: {', '.join(VALID_TOPICS)}")
        db = ctx["db"]

        # Upsert: insert or do nothing on conflict, then fetch
        stmt = (
            insert(UserProgress)
            .values(user_id=user.id, topic=topic)
            .on_conflict_do_nothing(constraint="uq_user_topic")
        )
        await db.execute(stmt)
        await db.commit()

        result = await db.execute(
            select(UserProgress).where(
                UserProgress.user_id == user.id, UserProgress.topic == topic
            )
        )
        progress = result.scalar_one()
        return _to_type(progress)
