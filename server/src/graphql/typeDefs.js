const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Task {
    id: ID!
    user: User!
    title: String!
    description: String
    status: String!
    priority: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getTasks: [Task]
    getTask(id: ID!): Task
    me: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createTask(title: String!, description: String, priority: String): Task
    updateTask(id: ID!, title: String, description: String, status: String, priority: String): Task
    deleteTask(id: ID!): String
  }
`.trim();

module.exports = typeDefs;
