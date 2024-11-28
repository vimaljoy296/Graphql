const { gql } = require('apollo-server');

const typeDefs = gql`
    type Team {
        id: ID!
        name: String!
        city: String!
        championshipsWon: Int!
    }

    type Player {
        id: ID!
        name: String!
        teamId: Int!
        position: String!
        age: Int!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        role: String!
    }

    type Query {
        teams: [Team!]!
        players: [Player!]!
        team(id: ID!): Team
        playersByTeam(teamId: Int!): [Player!]!
    }

    type Mutation {
        login(email: String!, password: String!): String
        addTeam(name: String!, city: String!, championshipsWon: Int!): Team
        addPlayer(name: String!, teamId: Int!, position: String!, age: Int!): Player
        updateTeam(id: ID!, championshipsWon: Int!): Team
        deletePlayer(id: ID!): Player
    }
`;

module.exports = typeDefs;
