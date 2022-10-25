import { Axios } from "axios";
import React, { useEffect } from "react";
import { auth } from "../_actions/user_action";
import { useDispatch } from "react-redux";

//null 아무나 출입 가능
//true 로그인한 유저만
//false 로그인한 유저만 불가능
export default function (SpecificComponent, option, adminRote = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch([])();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);
      });
    }, []);
    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
