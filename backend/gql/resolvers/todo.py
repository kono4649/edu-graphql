import strawberry
from sqlalchemy import select
from strawberry.types import Info

from gql.types.todo import TodoType
from models.todo import Todo


def _to_type(todo: Todo) -> TodoType:
    return TodoType(id=strawberry.ID(str(todo.id)), title=todo.title, done=todo.done, user_id=todo.user_id)


class TodoQuery:
    @strawberry.field
    async def todos(self, info: Info) -> list[TodoType]:
        ctx = info.context
        user = ctx["user"]
        if user is None:
            raise Exception("Authentication required")
        db = ctx["db"]
        result = await db.execute(select(Todo).where(Todo.user_id == user.id))
        return [_to_type(t) for t in result.scalars().all()]


class TodoMutation:
    @strawberry.mutation
    async def create_todo(self, info: Info, title: str) -> TodoType:
        ctx = info.context
        user = ctx["user"]
        if user is None:
            raise Exception("Authentication required")
        db = ctx["db"]
        todo = Todo(title=title, done=False, user_id=user.id)
        db.add(todo)
        await db.commit()
        await db.refresh(todo)
        return _to_type(todo)

    @strawberry.mutation
    async def update_todo(self, info: Info, id: strawberry.ID, done: bool) -> TodoType:
        ctx = info.context
        user = ctx["user"]
        if user is None:
            raise Exception("Authentication required")
        db = ctx["db"]
        result = await db.execute(
            select(Todo).where(Todo.id == int(id), Todo.user_id == user.id)
        )
        todo = result.scalar_one_or_none()
        if todo is None:
            raise Exception("Todo not found")
        todo.done = done
        await db.commit()
        await db.refresh(todo)
        return _to_type(todo)

    @strawberry.mutation
    async def delete_todo(self, info: Info, id: strawberry.ID) -> bool:
        ctx = info.context
        user = ctx["user"]
        if user is None:
            raise Exception("Authentication required")
        db = ctx["db"]
        result = await db.execute(
            select(Todo).where(Todo.id == int(id), Todo.user_id == user.id)
        )
        todo = result.scalar_one_or_none()
        if todo is None:
            raise Exception("Todo not found")
        await db.delete(todo)
        await db.commit()
        return True
