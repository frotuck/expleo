catalogue = db.getSiblingDB("expleo-todo");
catalogue.createUser(
  {
    user: "expleo",
    pwd:  "todo",
    roles: [ { role: "readWrite", db: "expleo-todo" } ]
  }
);