import express, { request, response } from "express";

const app = express();
// Botar a funcionalidade para o express reconhecer o JSON
app.use(express.json());

// ROTA: Endereço completo da requisição
// RECURSO: Qual entidade estamos acessando do sistema

// GET: Buscar um ou mais informações do bac-end
// POST: Criar uma nova informação do back-end
// PUT: Atualizar uma informação existente no back-end
// DELETE: Remover uma informação do back-end

// POST: http://localhost:1111/users = Cria um usuário
// GET: http://localhost:1111/users = Listar usuários
// GET: http://localhost:1111/users/5 = Buscar dados do usuário com ID 5

// REQUEST PARAM: Parâmetros que vem na própria rota que identificam um recurso. O Parametro é obrigatorio.
// QUERY PARAM = Parâmetros que vem na própria rota geralmente opcionais para filtros, paginação...
// REQUEST BODY = Parâmetros para criação/atualização de informações

// Banco de Dados
// SQL = SELECT * FROM users WHERE name = 'Paulo'
// KNEX = knex('users').where('name','Paulo' ).select('*') 

const users = ["Paulo", "Carol", "João"];

app.get("/users", (request, response) => {
  console.log("Listagem de usuarios");

  // QUERY PARAM
  const search = String(request.query.search);
  const filteredUsers = search
    ? users.filter((user) => user.includes(search))
    : users;

  return response.json(filteredUsers);
});

// REQUEST PARAM
app.get("/users/:id", (request, response) => {
  const id = Number(request.params.id);
  const user = users[id];

  return response.json([user]);
});

app.post("/users", (request, response) => {
  const data = request.body;

  // REQUEST BODY
  const user = {
    name: data.name,
    email: data.email,
  };

  return response.json(user);
});

app.listen(1111);
