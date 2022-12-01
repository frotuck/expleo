use admin;
db.createUser(
  {
    user: "admin",
    pwd:  "admin123",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
);
//would not work only admin worked *sad face*
use expleo-todo;
db.createUser(
  {
    user: "expleo",
    pwd:  "asdf",
    roles: [ { role: "readWrite", db: "expleo-todo" } ]
  }
);