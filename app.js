const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "todoApplication.db");
const app = express();

app.use(express.json());

let database = null;

const initializeDBAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const checkRequestQueries = async (request, response, next) => {
  const { search_q, category, priority, status, date } = request.query;
  const { todoId } = request.params;
  if (category !== undefined) {
    const categoryArray = ["WORK", "HOME", "LEARNING"];
    const categoryIsInArray = categoryArray.includes(category);
    if (categoryIsInArray === true) {
      request.category = category;
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
      return;
    }
  }

  if (priority !== undefined) {
    const priorityArray = ["HIGH", "MEDIUM", "LOW"];
    const priorityIsInArray = priority.includes(priority);
    if (priorityIsInArray === true) {
      request.priority = priority;
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
      return;
    }
  }
  if (status !== undefined) {
    const statusArray = ["TO DO", "IN PROGRESS", "DONE"];
    const statusIsInArray = statusArray.includes(status);
    if (statusIsInArray === true) {
      request.status = status;
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
      return;
    }
  }
  if (date !== undefined) {
    try {
      const myDate = new Date(date);

      const formatedDate = format(new Date(date), "yyyy-MM-dd");
      console.log(formatedDate, "f");
      const result = toDate(
        new Date(
          `${myDate.getFullYear()}-${myDate.getMonth()}-${myDate.dateDate()}`
        )
      );
      console.log(result, "r");
      console.log(new Date(), "new");

      const isValidDate = await isValid(result);
      console.log(isValidDate, "V");
      if (isValidDate === true) {
        request.date = formatedDate;
      } else {
        response.status(400);
        response.send("Invalid Due Date");
        return;
      }
    } catch (error) {
      response.status(400);
      response.send("Invalid Due Date");
      return;
    }
  }
  request.todoId = todoId;
  request.search_q = search_q;

  next();
};

const checkRequestBody = (request, response, next) => {
  const { id, todo, category, priority, status, dueDate } = request.body;
  const { todoId } = request.params;
  if (category !== undefined) {
    categoryArray = ["WORK", "HOME", "LEARNING"];
    categoryIsInArray = categoryArray.includes(category);
    if (categoryIsInArray === true) {
      request.category = category;
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
      return;
    }
  }
  if (priority !== undefined) {
    const priorityArray = ["HIGH", "MEDIUM", "LOW"];
    const priorityIsInArray = priority.includes(priority);
    if (priorityIsInArray === true) {
      request.priority = priority;
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
      return;
    }
  }
  if (status !== undefined) {
    statusArray = ["TO DO", "IN PROGRESS", "DONE"];
    statusIsInArray = statusArray.includes(status);
    if (statusIsInArray === true) {
      request.status = status;
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
      return;
    }
  }
  if (dueDate !== undefined) {
    try {
      const myDate = new Date(date);

      const formatedDate = format(new Date(dueDate), "yyyy-MM-dd");
      console.log(formatedDate);
      const result = toDate(new Date(formatedDate));

      const isValidDate = isValid(result);
      console.log(isValidDate);
      if (isValidDate === true) {
        request.dueDate = formatedDate;
      } else {
        response.status(400);
        response.send("Invalid Due Date");
        return;
      }
    } catch (error) {
      response.status(400);
      response.send("Invalid Due Date");
      return;
    }
  }
  request.todoId = todoId;
  request.id = id;
  request.todo = todo;
  next();
};

app.get("/todos/", checkRequestQueries, async (request, response) => {
  const { status = "", search_q = "", priority = "", category = "" } = request;
  console.log(status, search_q, priority, category);
  const getTodosStatusQuery = `
        SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
        FROM
            todo
        WHERE
            status LIKE '%${status}%';`;
  const todosStatusArray = await database.all(getTodosStatusQuery);
  response.send(todosStatusArray);
});
app.get("/todos/", checkRequestQueries, async (request, response) => {
  const { status = "", search_q = "", priority = "", category = "" } = request;
  console.log(status, search_q, priority, category);
  const getTodosPriorityQuery = `
        SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
        FROM
            todo
        WHERE
            priority LIKE '%${priority}%';`;
  const todosPriorityArray = await database.all(getTodosPriorityQuery);
  response.send(todosPriorityArray);
});

app.get("/todos/", checkRequestQueries, async (request, response) => {
  const { status = "", search_q = "", priority = "", category = "" } = request;
  console.log(status, search_q, priority, category);
  const getTodosPriorityAndStatusQuery = `
        SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
        FROM
            todo
        WHERE
            priority LIKE '%${priority}%'
            AND status LIKE '%${status}%';`;
  const todosPriorityAndStatusArray = await database.all(
    getTodosPriorityAndStatusQuery
  );
  response.send(todosPriorityAndStatusArray);
});

app.get("/todos/", checkRequestQueries, async (request, response) => {
  const { status = "", search_q = "", priority = "", category = "" } = request;
  console.log(status, search_q, priority, category);
  const getTodosQuery = `
        SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
        FROM
            todo
        WHERE
            todo LIKE '%${search_q}%';`;
  const todosArray = await database.all(getTodosQuery);
  response.send(todosArray);
});

app.get("/todos/", checkRequestQueries, async (request, response) => {
  const { status = "", search_q = "", priority = "", category = "" } = request;
  console.log(status, search_q, priority, category);
  const getTodosCategoryAndStatusQuery = `
        SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
        FROM
            todo
        WHERE
            category LIKE '%${category}%'
            AND status LIKE '%${status}%';`;
  const todosCategoryAndStatusArray = await database.all(
    getTodosCategoryAndStatusQuery
  );
  response.send(todosCategoryAndStatusArray);
});

app.get("/todos/", checkRequestQueries, async (request, response) => {
  const { status = "", search_q = "", priority = "", category = "" } = request;
  console.log(status, search_q, priority, category);
  const getTodosCategoryQuery = `
        SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
        FROM
            todo
        WHERE
            category LIKE '%${category}%';`;
  const todosCategoryArray = await database.all(getTodosCategoryQuery);
  response.send(todosCategoryArray);
});

app.get("/todos/", checkRequestQueries, async (request, response) => {
  const { status = "", search_q = "", priority = "", category = "" } = request;
  console.log(status, search_q, priority, category);
  const getTodosCategoryAndPriorityQuery = `
        SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
        FROM
            todo
        WHERE
            category LIKE '%${category}%'
            AND priority LIKE '%${priority}%';`;
  const todosCategoryAndPriorityArray = await database.all(
    getTodosCategoryAndPriorityQuery
  );
  response.send(todosCategoryAndPriorityArray);
});

app.get("/todos/:todoId", checkRequestQueries, async (request, response) => {
  const { todoId } = request;
  const getTodoQuery = `
        SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
        FROM
            todo
        WHERE
            id = ${todoId};`;
  const todo = await database.get(getTodoQuery);
  response.send(todo);
});

app.get("/agenda/", checkRequestQueries, async (request, response) => {
  const { date } = request;
  console.log(date, "a");

  const selectDueDateQuery = `
        SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
        FROM
            todo
        WHERE
            due_date = '${date}';`;
  const todosArray = await database.all(selectDueDateQuery);
  if ((todosArray = undefined)) {
    response.status(400);
    response.send("Invalid Due Date");
  } else {
    response.send(todosArray);
  }
});

app.post("/todos/", checkRequestBody, async (request, response) => {
  const { id, todo, category, priority, status, dueDate } = request;

  const addTodoQuery = `
        INSERT INTO
            todo(id,todo,priority,status,category,due_date)
        VALUES(
            ${id},
            '${todo}',
            '${priority}',
            '${status}',
            '${category}',
            '${dueDate}'
        );`;
  const createUser = await database.run(addTodoQuery);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", checkRequestBody, async (request, response) => {
  const { todoId } = request;

  const { priority, todo, status, dueDate, category } = request;
  let updateTodoQuery = null;
  switch (true) {
    case status !== undefined:
      updateStatusQuery = `
                UPDATE
                    todo
                SET
                    status = '${status}'
                WHERE
                    id = ${todoId};`;
      await database.run(updateStatusQuery);
      response.send("Status Updated");
      break;
    case priority !== undefined:
      updatePriorityQuery = `
                UPDATE
                    todo
                SET
                    priority = '${priority}'
                WHERE
                    id = ${todoId};`;
      await database.run(updatePriorityQuery);
      response.send("Priority Updated");
      break;
    case todo !== undefined:
      updateTodoQuery = `
                UPDATE
                    todo
                SET
                    todo = '${todo}'
                WHERE
                    id = ${todoId};`;
      await database.run(updateTodoQuery);
      response.send("Todo Updated");
      break;
    case category !== undefined:
      updateCategoryQuery = `
                UPDATE
                    todo
                SET
                    category = '${category}'
                WHERE
                    id = ${todoId};`;
      await database.run(updateCategoryQuery);
      response.send("Category Updated");
      break;
    case dueDate !== undefined:
      updateDueDateQuery = `
                UPDATE
                    todo
                SET
                    due_date = '${dueDate}'
                WHERE
                    id = ${todoId};`;
      await database.run(updateDueDateQuery);
      response.send("Due Date Updated");
      break;
  }
});

app.delete("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
        DELETE FROM
            todo
        WHERE
            id = ${todoId};`;
  await database.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
