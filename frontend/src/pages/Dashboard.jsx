import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { useEffect, useState } from "react";
import axios from "axios";
import { Users } from "../components/Users";
import { useDebounce } from "../hooks/useDebounce";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [value, setValue] = useState(0);
  const [user, setUser] = useState(null);
  const debouncedFilter= useDebounce(filter, 1000);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/user/bulk?filter=" + debouncedFilter,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        setUsers(response.data.users);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, [debouncedFilter]);

  
  useEffect(()=>{
    const fetchValue= async() =>{
      try{
        const response= await axios.get("http://localhost:5000/api/v1/account/balance",{
           headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
           }
        });
        setValue(response.data.balance);
      }catch(err){
        console.log(err);
      }
    };
    fetchValue();
  },[]);
    
  
  useEffect(()=>{
    const fetchUser= async() =>{
      try{
        const response= await axios.get("http://localhost:5000/api/v1/user/details",{
           headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
           }
        });
        setUser(response.data);
      }catch(err){
        console.log(err);
      }
    };
    fetchUser();
  },[]);
  
  return (
    <div>
      <Appbar user={user}/>
      <Balance value={value}/>
      <Users users={users} setFilter={setFilter} />
    </div>
  );
}
