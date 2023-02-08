const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

console.log('environment    ', process.env.ENVIRONMENT);
console.log('PORT    ', process.env.PORT);
console.log('MONGO_CONNECTION_STRING    ', process.env.MONGO_CONNECTION_STRING);
if (process.env.ENVIRONMENT !== 'production') {
  require('dotenv').config();
}

var whitelist = ['*'];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const taskController = require('./controller/task.controller');

const app = express();
app.use(cors());
const port = process.env.PORT || 3080;

app.use(express.static(path.join(__dirname, './ui/build')));
app.use(bodyParser.json());

app.get('/api/tasks', (req, res) => {
  taskController.getTasks().then((data) => res.json(data));
});

app.post('/api/task', (req, res) => {
  console.log(req.body);
  taskController.createTask(req.body.task).then((data) => res.json(data));
});

app.put('/api/task', (req, res) => {
  taskController.updateTask(req.body.task).then((data) => res.json(data));
});

app.delete('/api/task/:id', (req, res) => {
  taskController.deleteTask(req.params.id).then((data) => res.json(data));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './ui/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on the port  ${port}`);
});
