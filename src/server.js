const express = require("express")
const server = express()

//Pegar o banco de dados
const db = require("./database/db")

//Configurar pasta publica
server.use(express.static("public"))

//Habilitar o uso de req.body
server.use(express.urlencoded({extended: true}))

//Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//Configurar caminhos da minha aplicação
//Req: requisição
//Res: resposta
server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {

    req.query




    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    //Inserir dados no DB
        const query = `
            INSERT INTO places(
                image,
                name,
                adress,
                adress2,
                state,
                city,
                items
            ) VALUES(?, ?, ?, ?, ?, ?, ?);
        `

        const values = [
            req.body.image,
            req.body.name,
            req.body.adress,
            req.body.adress2,
            req.body.state,
            req.body.city,
            req.body.items
        ]

        function afterInsertData(err){
            if(err){
                return console.log(err)
            }
            
            console.log("Cadastrado com sucesso!")
            console.log(this)

            return res.render("create-point.html", {saved: true})
        }

    db.run(query, values, afterInsertData)

    
    
})


server.get("/search", (req, res) => {
    // Pegar os dados do DB
    
    const search = req.query.search

    if(search == ""){
        return res.render("search-results.html", { total: 0})
    }
    
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rowns){
        if(err){
            return console.log(err)
        }

        const total = rowns.length

        //Mostrar a página HTML com os dados do DB
        return res.render("search-results.html", {places: rowns, total})

    })

})


//Ligar o servidor
server.listen(3000)