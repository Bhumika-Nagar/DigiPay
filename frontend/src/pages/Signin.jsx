import React from 'react'
import { Heading } from '../components/Heading'
import { SubHeading } from '../components/SubHeading'
import { InputBox } from '../components/InputBox'
import { Bottom } from '../components/Bottom'
import { Button } from '../components/Button'
import { Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

const Signin = () => {
  const [username,setUsername]= useState("");
  const [password,setPassword]= useState("");
  const navigate= useNavigate();
  return (
    <div>
      <Heading label={"Sign In"}/>
      <SubHeading label={"Enter your info to log in account"}/>
      <InputBox label={"EMAIL"} placeholder="johndoe@gmail.com" onChange={e=>{setUsername(e.target.value)}}/>
      <InputBox label={"PASSWORD"} placeholder="123456" onChange={e=>{setPassword(e.target.value)}}/>
      
      <Button label={"Sign in"} onClick={async()=>{
        try{
            const response=await axios.post("http://localhost:5000/api/v1/user/signin",{
              username,
              password
            })
            localStorage.setItem("token",response.data.token);

            navigate("/dashboard");
            }catch(err){
              console.log(err.response?.data);
              alert("signin failed");
            }
      }}/>
        <Bottom label={"Don't have an account ?"} buttonText={"Sign up"} to={"/signup"}/>
      
    </div>
  )
}

export default Signin
