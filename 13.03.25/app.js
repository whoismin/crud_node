const express = require("express");
const bodyParser = require("body-parser");
const expressHandlebars = require("express-handlebars");
const Post = require("./models/post");

const app = express();

// Configuração do Handlebars com Helpers
const hbs = expressHandlebars.create({
    defaultLayout: "main",
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Middleware para Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servindo arquivos estáticos (caso precise de CSS, JS, imagens, etc.)
app.use(express.static("public"));

// Rota principal
app.get("/", (req, res) => {
    res.render("primeira_pagina");
});

// Rota de consulta (listar todos os agendamentos)
app.get("/consulta", async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.render("consulta", { posts });
    } catch (erro) {
        res.send("Erro ao listar agendamentos: " + erro);
    }
});

// Rota para cadastrar novo agendamento
app.post("/cadastrar", async (req, res) => {
    try {
        await Post.create({
            nome: req.body.nome,
            telefone: req.body.telefone,
            origem: req.body.origem,
            data_contato: req.body.data_contato,
            observacao: req.body.observacao
        });
        res.redirect("/consulta"); // Redireciona para a listagem após cadastro
    } catch (erro) {
        res.send("Erro ao criar agendamento: " + erro);
    }
});

// Rota para exibir o formulário de atualização com dados preenchidos
app.get("/atualizar/:id", async (req, res) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });

        if (!post) {
            return res.send("Agendamento não encontrado.");
        }

        res.render("atualizar", { post: post.toJSON() });
    } catch (erro) {
        res.send("Erro ao buscar agendamento: " + erro);
    }
});
 
 
app.post("/excluir/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await Post.destroy({ where: { id } });
        res.redirect("/consulta?excluido=true"); // envia o parâmetro para exibir o modal
    } catch (erro) {
        res.send("Erro ao excluir: " + erro);
    }
});


// Rota para atualizar os dados no banco
app.post("/atualizar/:id?", async (req, res) => {
    try {
        const id = req.params.id || req.body.id; // Obtém o ID da URL ou do formulário

        if (!id) {
            return res.send("Erro: ID do agendamento não fornecido.");
        }

        await Post.update(
            {
                nome: req.body.nome,
                telefone: req.body.telefone,
                origem: req.body.origem,
                data_contato: req.body.data_contato,
                observacao: req.body.observacao
            },
            { where: { id: id } }
        );

        res.redirect("/consulta"); // Redireciona para a listagem após a atualização
    } catch (erro) {
        res.send("Erro ao atualizar agendamento: " + erro);
    }
});

// Servidor rodando
app.listen(8081, () => {
    console.log("Servidor ativo na porta 8081!");
});
