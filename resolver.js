const jwt = require("jsonwebtoken");

// New Mock Data
const teams = [
  { id: 1, name: "Warriors", city: "San Francisco", championshipsWon: 7 },
  { id: 2, name: "Lakers", city: "Los Angeles", championshipsWon: 17 },
  { id: 3, name: "Bulls", city: "Chicago", championshipsWon: 6 }
];

const players = [
  { id: 1, name: "Stephen Curry", teamId: 1, position: "Point Guard", age: 35 },
  { id: 2, name: "LeBron James", teamId: 2, position: "Forward", age: 38 },
  { id: 3, name: "Michael Jordan", teamId: 3, position: "Guard", age: 60 }
];

const users = [
  { id: 1, name: "Alice", email: "alice@example.com", password: "password123", role: "USER" },
  { id: 2, name: "Bob", email: "bob@example.com", password: "admin123", role: "ADMIN" }
];

const SECRET_KEY = "mysecretkey";

const resolvers = {
  Query: {
    teams: () => teams,
    players: () => players,
    team: (_, { id }) => teams.find(team => team.id === Number(id)),
    playersByTeam: (_, { teamId }) => players.filter(player => player.teamId === teamId),
  },

  Mutation: {
    login: (_, { email, password }) => {
      const user = users.find(user => user.email === email);
      if (!user) throw new Error("Authentication failed: User not found");
      if (user.password !== password) throw new Error("Authentication failed: Incorrect password");

      return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    },

    addTeam: (_, { name, city, championshipsWon }, { token }) => {
      if (!token) throw new Error("Authentication required: Token not found");

      try {
        const user = jwt.verify(token, SECRET_KEY);

        if (user.role !== "ADMIN") {
          throw new Error("Authorization failed: Only admins can add teams");
        }

        const newTeam = { id: teams.length + 1, name, city, championshipsWon };
        teams.push(newTeam);
        return newTeam;

      } catch (err) {
        throw new Error("Authentication failed: Token is invalid or expired");
      }
    },

    addPlayer: (_, { name, teamId, position, age }, { token }) => {
      if (!token) throw new Error("Authentication required: Token not found");

      try {
        const user = jwt.verify(token, SECRET_KEY);

        if (user.role !== "ADMIN") {
          throw new Error("Authorization failed: Only admins can add players");
        }

        const newPlayer = { id: players.length + 1, name, teamId, position, age };
        players.push(newPlayer);
        return newPlayer;

      } catch (err) {
        throw new Error("Authentication failed: Token is invalid or expired");
      }
    },

    updateTeam: (_, { id, championshipsWon }, { token }) => {
      if (!token) throw new Error("Authentication required: Token not found");

      try {
        const user = jwt.verify(token, SECRET_KEY);

        if (user.role !== "ADMIN") {
          throw new Error("Authorization failed: Only admins can update teams");
        }

        const team = teams.find(team => team.id === Number(id));
        if (!team) throw new Error("Team not found");

        team.championshipsWon = championshipsWon;
        return team;

      } catch (err) {
        throw new Error("Authentication failed: Token is invalid or expired");
      }
    },

    deletePlayer: (_, { id }, { token }) => {
      if (!token) throw new Error("Authentication required: Token not found");

      try {
        const user = jwt.verify(token, SECRET_KEY);

        if (user.role !== "ADMIN") {
          throw new Error("Authorization failed: Only admins can delete players");
        }

        const playerIndex = players.findIndex(player => player.id === Number(id));
        if (playerIndex === -1) throw new Error("Player not found");

        const deletedPlayer = players.splice(playerIndex, 1);
        return deletedPlayer[0];

      } catch (err) {
        throw new Error("Authentication failed: Token is invalid or expired");
      }
    }
  }
};

module.exports = resolvers;
