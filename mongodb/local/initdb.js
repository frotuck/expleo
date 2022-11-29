//@ts-nocheck
use admin;
db.createUser(
  {
    user: "admin",
    pwd:  "admin123",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
);
use expleo-todo;
db.createUser(
  {
    user: "expleo",
    pwd:  "todo",
    roles: [ { role: "readWrite", db: "expleo-todo" } ]
  }
);