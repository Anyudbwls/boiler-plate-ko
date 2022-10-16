import axios from "axios";
import { LOGIN_USER } from "./types";

/**
 * 화살표 함수
 * () => ...
 *
 * 앞, 뒤 괄호는 생략 가능
 * a => console.log(a)
 * (a) => console.log(a)
 * () => console.log
 * (a) => {
 *      console.log(a);
 *      return a;
 * }
 * (a) => a;
 * a => a;
 * a => ({ a: 1 });
 *
 * .then의 의미
 * .post함수가 프로미스(미래에 대한 응답)를 반환하는 함수인거야.
 */
export const loginUser = async (dataToSubmit) => {
  const request = await axios.post(
    "http://localhost:5002/api/user/login",
    dataToSubmit
  );
  console.log(request);
  //request를 reducer에 넘겨줌
  return {
    type: LOGIN_USER,
    payload: request.data,
  };
};
