


const express = require('express')
const axios = require('axios')
const path = require('path')
const app = express()
var bodyParser = require('body-parser')



//const base_url = "http://localhost:3000"
const base_url = "http://node56384-noderest-test1.proen.app.ruk-com.cloud"
http://node56384-noderest-test1.proen.app.ruk-com.cloud/
//const base_url = "http://10.104.7.149"



app.set('views', path.join(__dirname, "/public/views"))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false}))


app.use(express.static(__dirname + '/public'))

app.get('/', async(req,res)=>{
   try{
    const respones = await axios.get(base_url + '/books')
    res.render("books",{books:respones.data})
   }catch(err){
    console.error(err)
    res.status(500).send('Error')
   }
})

app.get('/book/:id',async(req,res)=>{
    try{
        const respones = await axios.get(base_url + '/books/' + req.params.id)
        res.render("book",{book:respones.data})
       }catch(err){
        console.error(err)
        res.status(500).send('Error')
       }
})

app.get('/create',(req,res)=>{ // show create desktop
    res.render("create")
})

app.post('/create',async(req,res)=>{
   try{
    const data = { title: req.body.title , author: req.body.author}
    await axios.post(base_url + '/books' ,data)
    res.redirect('/')
   }catch(err){
    console.error(err)
    res.status(500).send('Error')
   }
})

app.get('/update/:id',async(req,res)=>{
    try{
        const respones = await axios.get(
            base_url + '/books/' + req.params.id) 
            res.render('update',{book: respones.data})
  } catch(err){
      console.error(err)
      res.status(500).send('Error')
    }
})

app.post('/update/:id',async(req,res)=>{
   try{
    const data = { title: req.body.title , author: req.body.author}
    await axios.put(base_url + '/books/' + req.params.id,data)
    res.redirect('/')
   }catch(err){
    console.error(err)
    res.status(500).send('Error')
   }
})

app.get('/delete/:id',async(req,res)=>{
   try{
    await axios.delete(base_url + '/books/' + req.params.id)
    res.redirect('/')
   }catch(err){
    console.error(err)
    res.status(500).send('Error')
   }
})

app.listen(5500,()=> console.log(`Listening on port 5500`))