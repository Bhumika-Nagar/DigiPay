import { InputBox } from "../components/InputBox";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading"
import { Button } from "../components/Button";
import { Bottom } from "../components/Bottom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate= useNavigate();

  const[firstname, setFirstname]=useState("");
  const[lastname, setLastname]=useState("");
  const[username, setUsername]=useState("");
  const[password, setpassword]=useState("");


  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center">
            <Heading label={"Sign up"} />
            <SubHeading label={"Enter your info to create account"}/>
            <InputBox  onChange={e=>{setFirstname(e.target.value)}}  placeholder="John " label={ "FIRSTNAME" } />
            <InputBox  onChange={e=>{setLastname(e.target.value)}}  placeholder="Doe" label={ "LASTNAME" } />
            <InputBox  onChange={e=>{setUsername(e.target.value)}}  placeholder="johndoe@gmail.com" label={ "EMAIL" } />
            <InputBox  onChange={e=>{setpassword(e.target.value)}}  placeholder="123456" label={ "PASSSWORD" } />
            <div className="pt-4">
                <Button onClick={async()=>{
                  try{
                  const response = await axios.post("http://localhost:5000/api/v1/user/signup",{
                    username,
                    firstname,
                    lastname,
                    password
                  });
                  localStorage.setItem("token",response.data.token)
                  
                  navigate("/dashboard")

                }catch(err){
                  console.log(err);
                  alert("signup failed");
                }
                }} label={"Sign up"} />
            </div>
            <Bottom label={"Already have an account ?"} buttonText={"Sign in"} to={"/signin"}/>
        </div>

      </div>
      
    </div>
  )
}

export default Signup
