import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getTodoById, updateTodo } from '../../helpers/todosAcess'
import { updateTodoBuilder } from '../../helpers/todos'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updateTodoData: UpdateTodoRequest = JSON.parse(event.body)

    const todo = updateTodoBuilder(updateTodoData, todoId)

    if (!todo) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          item: null
        })
      }
    } else {
      console.log(updateTodoData)
    }

    const oldTodo = await getTodoById(todoId)

    await updateTodo(oldTodo, todo)

    return {
      statusCode: 201,
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
