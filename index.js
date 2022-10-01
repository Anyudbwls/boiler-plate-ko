const express = require('express') //express 가져오기
const app = express()
const port = 3000
const bodyParser =require('body-parser');

const config = require('./config/key');

const { User} =require('./models/User');

//bodyParser가 client에서 오는 정보를 서버에서 분석해서 가져올수 있게함.
//application/x-ww-form-urlencoded 분석
app.use(bodyParser.urlencoded({extended:true}));

//application/json 분석
app.use(bodyParser.json());

const mongoose = require('mongoose');
const mongoDbUri = "mongodb+srv://anyu:1234@cluster0.vkganus.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(config.mongoURI, {
  useNewUrlParser:true,
}).then(()=>console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {res.send('Hello World!~~안녕하세요~')})

app.post('/register', (req,res)=> {
  //회원가입 할때 필요한 정보를 client에서 가져오면
  //그것들을 데이터 베이스에 넣어둔다.
  const user = new User(req.body)
  
  user.save((err,userInfo) => {
    if(err) return res.json({success: false,err})
    console.log(userInfo);
    return res.status(200).json({
      success:true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

