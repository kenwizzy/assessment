
# Todo App - Laravel + React + Docker
This is a Todo application with drag-and-drop, built with Laravel 13 and React 19.

## SETUP
1. After cloning, cd to the backend directory
2. rename .env.example to .env
3. cd to the frontend directory
4. rename .env.example to .env
5. start up the services by running "docker-compose up -d" to spring up the containers
6. After containers are up and running, run docker-compose exec backend php artisan migrate to migrate database
7. Once migration is successful, you can access the url http://localhost:5173/ to access the application.

## DATABASE CONFIGURATION

- DB_HOST=127.0.0.1
- DB_PORT=3307
- DB_DATABASE=todo-api
- DB_USERNAME=laravel
- DB_PASSWORD=password


# API DOCUMENTATION 

## URLS
baseURL=http://localhost:8000

## GET ALL TODOS
endpoint: {{baseURL}}/api/todos
method: get
response: {
    "success": true,
    "message": "Todos retrieved successfully",
    "data": [
        {
            "id": 3,
            "title": "Testing",
            "is_completed": 0,
            "position": 0,
            "created_at": "2026-03-30T08:58:30.000000Z",
            "updated_at": "2026-03-30T09:30:19.000000Z"
        },
        {
            "id": 2,
            "title": "Testing 2",
            "is_completed": 0,
            "position": 2,
            "created_at": "2026-03-30T07:13:04.000000Z",
            "updated_at": "2026-03-30T09:30:19.000000Z"
        },
        {
            "id": 6,
            "title": "Another Testing",
            "is_completed": 0,
            "position": 3,
            "created_at": "2026-03-30T09:43:15.000000Z",
            "updated_at": "2026-03-30T09:43:15.000000Z"
        }
    ]
}

## CREATE TODO
endpoint: {{baseURL}}/api/todos
method: post
payload: {title: "Testing"}

response:
        {
    "success": true,
    "message": "Todo created successfully",
    "data": {
        "title": "Testing",
        "is_completed": false,
        "position": 4,
        "updated_at": "2026-03-30T10:29:38.000000Z",
        "created_at": "2026-03-30T10:29:38.000000Z",
        "id": 8
    }
}


## UPDATE TODO
endpoint: {{baseURL}}/api/todos/todo
method: put

payload: {
   "id":3,
   "title":"testing",
   "is_completed":true,
   "position":0,
   }


response: 
        {
    "success": true,
    "message": "Todo updated successfully",
    "data": {
        "id": 8,
        "title": "Testing",
        "is_completed": true,
        "position": 4,
        "created_at": "2026-03-30T10:29:38.000000Z",
        "updated_at": "2026-03-30T10:40:22.000000Z"
    }
}

## DELETE TODO
endpoint: {{baseURL}}/api/todos/{id}
method: delete

response: {
    "success":true,
    "message":"Todo deleted successfully"
    }

 ## REORDER TODO
endpoint: {{baseURL}}/api/todos/reorder
method: post

payload: {
      "orderData":[
        {"id":11,"position":0},
        {"id":2,"position":1},
        {"id":3,"position":2},
        {"id":12,"position":3},
        {"id":9,"position":4},
        {"id":10,"position":5}
        ]
    }

response: {
    "success":true,
    "message":"Todos reordered successfully"
    }


 ## CLEAR COMPLETED TODO
endpoint: {{baseURL}}/api/todos/clear-completed
method: delete

response: {
    "success":true,
    "message":"2 completed todo(s) deleted successfully"
    }

    