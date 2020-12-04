const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid")

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const project = { 
    id: uuidv4(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(project)

  return response.status(201).json(project)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;
  const repositoryIndex = repositories
    .findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({"error": "Repository doesn't exist."});
  }

  if (likes !== undefined) {
    return response.status(400).json(repositories[repositoryIndex])
  }

  const project = { id: id, title: title, url: url, techs: techs }

  repositories[repositoryIndex] = project;

  return response.json(project)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories
    .findIndex(repository => repository.id === id)
  
  if (repositoryIndex < 0) {
    return response.status(400).json({"error": "Repository doesn't exist."});
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories
    .findIndex(repository => repository.id === id)
  
    if (repositoryIndex < 0) {
      return response.status(400).json({"error": "Repository doesn't exist."});
    }
  
  repositories[repositoryIndex].likes += 1;

  return response.status(201).json(repositories[repositoryIndex])
});

module.exports = app;
