import strawberry
from strawberry.fastapi import GraphQLRouter

from gql.resolvers.message import MessageMutation, MessageQuery, MessageSubscription
from gql.resolvers.progress import ProgressMutation, ProgressQuery
from gql.resolvers.todo import TodoMutation, TodoQuery
from gql.context import get_context


@strawberry.type
class Query(TodoQuery, MessageQuery, ProgressQuery):
    pass


@strawberry.type
class Mutation(TodoMutation, MessageMutation, ProgressMutation):
    pass


@strawberry.type
class Subscription(MessageSubscription):
    pass


schema = strawberry.Schema(query=Query, mutation=Mutation, subscription=Subscription)

graphql_router = GraphQLRouter(schema, context_getter=get_context)
