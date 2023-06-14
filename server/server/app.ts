import http, { IncomingMessage, Server, ServerResponse } from "http";
import { createData, fetchAllData, updateData, deleteData } from './engine';
/*
implement your server code here
*/

const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "GET" && req.url == "/data") {
    return fetchAllData(req, res);
  } else if (req.method === "POST" && req.url == "/data/add") {
    return createData(req, res);
  } else if (req.method === "PUT" && req.url === "/data/update") {
    updateData(req, res);
  } else if (req.method === "DELETE" && req.url === "/data/delete") {
    deleteData(req, res);
  } else {
    res.end("Data Not Found");
  }
}
);

server.listen(3005, () => console.log(`Server is listening on Port ${3005}`));
