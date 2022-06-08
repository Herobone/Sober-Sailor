/*****************************
 * Sober Sailor - The online Party Game
 * Copyright (c) 2022.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */
// Importing necessary modules
const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const emulators = spawn("firebase", ["emulators:start"]);

// Port on which the server will create
const PORT = 3069;

// Maps file extension to MIME types which
// helps browser to understand what to do
// with the file
const mimeType = {
  ".ico": "image/x-icon",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".eot": "application/vnd.ms-fontobject",
  ".ttf": "application/font-sfnt",
};

// Creating a server and listening at port 1800
http
  .createServer((req, res) => {
    const baseURL = "http://" + req.headers.host + "/";
    // Parsing the requested URL
    const parsedUrl = new URL(req.url, baseURL);

    // If requested url is "/" like "http://localhost:3069/"
    if (parsedUrl.pathname === "/") {
      let filesLink = "<ul>";
      res.setHeader("Content-type", "text/html");
      const filesList = fs.readdirSync("./tasks/");
      filesList.forEach((element) => {
        if (fs.statSync("./tasks/" + element).isFile()) {
          filesLink += `<br/><li><a href='tasks/${element}'>
                    ${element}
                </a></li>`;
        }
      });

      filesLink += "</ul>";

      res.end("<h1>List of files:</h1> " + filesLink);
    }

    /* Processing the requested file pathname to
          avoid directory traversal like,
          http://localhost:1800/../fileOutofContext.txt
          by limiting to the current directory only. */
    const sanitizePath = path
      .normalize(parsedUrl.pathname)
      .replace(/^(\.\.[\/\\])+/, "");

    let pathname = path.join(__dirname, "tasks", sanitizePath);

    if (!fs.existsSync(pathname)) {
      // If the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
    } else {
      // Read file from file system limit to
      // the current directory only.
      fs.readFile(pathname, function (err, data) {
        if (err) {
          res.statusCode = 500;
          res.end(`Error in getting the file.`);
        } else {
          // Based on the URL path, extract the
          // file extension. Ex .js, .doc, ...
          const ext = path.parse(pathname).ext;

          // If the file is found, set Content-type
          // and send data
          res.setHeader("Content-type", mimeType[ext] || "text/plain");

          res.end(data);
        }
      });
    }
  })
  .listen(PORT);

console.log(`Server listening on port ${PORT}`);

process.on("SIGINT", function () {
  emulators.kill("SIGINT");
  console.log("bye bye");
});

process.on("error", function () {
  emulators.kill("SIGINT");
  console.warn("Exiting with error");
});

emulators.stdout.on("data", (data) => {
  console.log(`Emulator: ${data}`);
});

emulators.stderr.on("data", (data) => {
  console.error(`Emulator (stderr): ${data}`);
});

emulators.on("error", (error) => {
  console.error(`Error: ${error.message}`);
});

emulators.on("close", (code) => {
  console.log(`Emulators exited with code ${code}`);
  process.exit();
});
