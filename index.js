const express = require('express')

const app = express()

const path = require('path')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

const sqlite = require('sqlite')

const dbConnection = sqlite.open(path.resolve(__dirname,'./banco.sqlite'), { Promise })
// const dbConnection = sqlite.open('./banco.sqlite', { Promise })

// const testDb = async() =>{
//     try {
//         const db = await dbConnection
//         const servicos = await db.all('SELECT * FROM servicos')
//         servicos.forEach(item => {
//             console.log(`${item.titulo} / ${item.conteudo}`)
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }
// testDb()

const port = process.env.PORT || 3000

app.get('/', (req, res)=>{
    res.render('home', {
        classMenuHome: ' active ',
        classMenuQuemSomos: '', 
        classMenuNossosServicos: '',
        classMenuContatos: '',
        slider: `<h3>Datamazon <br> Consultoria, pesquisa e Análise de dados <br></h3>`
    })
})
app.get('/quemsomos', (req, res)=>{
    res.render('quemsomos', {
        classMenuHome: '  ',
        classMenuQuemSomos: ' active ',
        classMenuNossosServicos: '',
        classMenuContatos: '',
        slider: `<h3>Quem Somos</h3>`
    })
})

app.get('/nossosservicos', async(req, res)=>{
    try {
        const db = await dbConnection
        const servicos = await db.all('SELECT * FROM servicos')
        res.render('nossosservicos',{
            servicos,
            classMenuHome: '  ',
            classMenuQuemSomos: '',
            classMenuNossosServicos: ' active ',
            classMenuContatos: '',
            slider: `<h3>Nossos Serviços</h3>`
        })
    } catch (error) {
        console.log(`aqui ---> ${error}`)
    }

})

app.get('/contatos', (req, res)=>{
    res.render('contatos', {
        classMenuHome: '  ',
        classMenuQuemSomos: '',
        classMenuNossosServicos: '',
        classMenuContatos: ' active ',
        slider: `<h3>Contatos</h3>`
    })
})

const init = async() => {
    const db = await dbConnection
    await db.run('create table if not exists servicos(id INTEGER PRIMARY KEY, titulo TEXT, conteudo TEXT)')
    //const tituloDb = `Criação de aplicativos para celular`
    //const conteudoDb = `` 
    //await db.run(`insert into servicos(id, titulo, conteudo) values(15, "${tituloDb}", "${conteudoDb}")`)
}

init()

app.listen(port, err => {
    if(err){
        console.log('Não foi possivel iniciar o servidor')
    }else{
        console.log('Servidor iniciado')
    }
})
