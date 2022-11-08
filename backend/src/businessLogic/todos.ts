import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { getUserId } from '../lambda/utils'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const bucketName = process.env.ATTACHMENT_S3_BUCKET

export function createTodoBuilder (createTodoData: CreateTodoRequest, event: APIGatewayProxyEvent): TodoItem | false {
  const todoId = uuid.v4()

  if ((createTodoData.name.length <= 0)) {
    return false
  } else {
    console.log(createTodoData)
  }

  const todo = {
    "todoId": todoId,
    "userId": getUserId(event),
    "createdAt": new Date().toISOString(),
    "done": false,
    "attachmentUrl": "",
    "name": createTodoData.name,
    "dueDate": createTodoData.dueDate
  }

  return todo as TodoItem
}

export function updateTodoBuilder (updateTodoData: UpdateTodoRequest, todoId: string): TodoUpdate | false {
  if ((updateTodoData.name.length <= 0) || (todoId.length <= 0)) {
    return false
  } else {
    console.log(todoId)
    console.log(updateTodoData)
  }

  const todo = {
    "name": updateTodoData.name,
    "dueDate": updateTodoData.dueDate,
    "done": updateTodoData.done
  }

  return todo as TodoUpdate
}

export function signedUrlBuilder (todo: TodoItem): TodoItem {
  todo.attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todo.todoId}`

  return todo as TodoItem
}

export function deleteTodoBuilder (todoId: string): boolean {
  if (todoId.length <= 0) {
    return false
  } else {
    console.log(todoId)
    return true
  }
}
