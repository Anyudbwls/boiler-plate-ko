const express = require("express"); //express 가져오기
const app = express();
const port = 5001;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");
const cors = require("cors");

const config = require("./config/key");

const { User } = require("./models/User");

//bodyParser가 client에서 오는 정보를 서버에서 분석해서 가져올수 있게함.
//application/x-ww-form-urlencoded 분석
app.use(bodyParser.urlencoded({ extended: true }));

// enable cors
app.use(cors());

//application/json 분석
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
const mongoDbUri =
  "mongodb+srv://anyu:1234@cluster0.vkganus.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!~~안녕하세요~");
});

app.get("/api/hello", (req, res) => {
  res.send("안녕하세요~");
});

app.post("/api/user/register", (req, res) => {
  //회원가입 할때 필요한 정보를 client에서 가져오면
  //그것들을 데이터 베이스에 넣어둔다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    // console.log(err);
    if (err) return res.json({ success: false, err });

    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/user/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.

  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.status(404).json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
    // console.log(user);
    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    // 자바스크립트가 함수형 프로그래밍을 지원하고, 자바스크립트의 함수는 1급 객체기 때문
    user.comparePassword(req.body.password, (err, isMatch) => {
      // console.log("err", err);
      // console.log("isMatch", isMatch);

      if (!isMatch) {
        return res.status(400).json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }

      //비밀번호 까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // 토큰을 저장한다. 어디에 ? 쿠키 , 로컳스토리지
        // console.log(user);

        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/user/auth", auth, (req, res) => {
  //여기꺼지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true 라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  console.log("요청 오나요? 로그아웃");
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    console.log(user);
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
