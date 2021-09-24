const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = []; // irá funcionar como um 'banco de dados' já que não conectamos um

//Middleware
function verifyIfExistsAccountCPF(request, response, next){
    const { cpf } = request.headers;

    const customer = customers.find((customer) => customer.cpf === cpf);

    if(!customer) {
        return response.status(400).json({error: "Customer not found"});
    }

    request.customer = customer; // para passar o customer para as demais rotas que estao chamando o middleware

    return next();
}

app.post("/account", (request, response) => {
    const { cpf, name } = request.body;

    const customerAlreadyExists = customers.some(
        (customer) => customer.cpf === cpf
    );

    if (customerAlreadyExists) {
        return response.status(400).json({ error: "Customer already exists!" });
    }

    // const id = uuidv4();

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send(); // 201 quando o dado for criado
});

// app.use(verifyIfExistsAccountCPF); // se eu precisar que todas as rotas abaixo usem o middleware.

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => { // middleware usado dessa forma se eu quiser que apenas algumas rotas especificas usem
    const { customer } = request; // recuperando o acesso oo customer do middleware
    return response.json(customer.statement);
});

// localhost:3333
app.listen(3333);