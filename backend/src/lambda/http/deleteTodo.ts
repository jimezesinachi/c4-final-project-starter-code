import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo, getTodoById } from '../../helpers/todosAcess'
import { deleteTodoBuilder } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    const isValidTodoId = deleteTodoBuilder(todoId)

    if (!isValidTodoId) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          item: null
        })
      }
    } else {
      console.log(todoId)
    }

    const todo = await getTodoById(todoId)

    await deleteTodo(todo)

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: todo
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
