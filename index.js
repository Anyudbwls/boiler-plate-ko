const express = require('express') //express 가져오기
const app = express()
const port = 3000
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://anyu:1234@cluster0.vkganus.mongodb.net/?retryWrites=true&w=majority',{
  useNewUrlParser:true,useUnifiedTopology:true, useCreateIndex:false 
}).then(()=>console.log('MonoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => {res.send('Hello World!~~안녕하세요')})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})