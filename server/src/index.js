const app = require("./app");
const { port } = require("./config");
const { users, tickets, statuses, priorities, categories, getNextTicketId, getNextLogId } = require("./data/store");

app.locals.store = {
  users,
  tickets,
  statuses,
  priorities,
  categories,
  getNextTicketId,
  getNextLogId
};

const serverPort = process.env.PORT || port;

app.listen(serverPort, () => {
  console.log(`HelpDesk Lite API running on http://localhost:${serverPort}`);
});
