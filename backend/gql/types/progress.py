from datetime import datetime

import strawberry


@strawberry.type
class ProgressType:
    id: strawberry.ID
    topic: str
    completed_at: datetime
