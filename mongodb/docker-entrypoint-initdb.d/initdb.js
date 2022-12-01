catalogue = db.getSiblingDB("expleo-todo");
catalogue.createUser(
  {
    user: "expleo",
    pwd: "asdf",
    roles: [ { role: "readWrite", db: "expleo-todo" } ]
  }
);