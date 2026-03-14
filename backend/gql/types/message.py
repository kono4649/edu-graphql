from datetime import datetime

import strawberry


@strawberry.type
class MessageType:
    id: strawberry.ID
    content: str
    user_id: int
    created_at: datetime
