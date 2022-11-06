import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createTodoBuilder } from '../../helpers/todos'
import { createTodo } from '../../helpers/todosAcess'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodoData: CreateTodoRequest = JSON.parse(event.body)

    const todo = createTodoBuilder(newTodoData, event)

    if (!todo) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          item: null
        })
      }
    } else {
      console.log(newTodoData)
    }

    const newTodo = await createTodo(todo)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newTodo
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
