import strawberry


@strawberry.type
class TodoType:
    id: strawberry.ID
    title: str
    done: bool
    user_id: int
