import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"
import { Loader2 } from "lucide-react"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";




const Login = () => {

// Taking data from input using 2 state variable 1. for signin, 2nd for login nput
const [signupInput, setSignupInput] = useState({
  name: "",
  email: "",
  password: "",
});
const [loginInput, setLoginInput] = useState({ email: "", password: "" });

const navigate = useNavigate();

// set handler 
const changeInputHandler = (e, type) => {
  // console.log(e)
  // console.log(e.target)
  // console.log(e.target.value);
  const { name, value } = e.target;  
  // name: This is the name of the input field (e.g., "name", "email", or "password").
// value: This is the current value of the input field — the text that the user has typed into the field.
// e.target.value will always give you the current value of the input field,
  if (type === "signup") {
    setSignupInput({ ...signupInput, [name]: value });
    // we set value correspond to its name in signupinput
  } else {
    setLoginInput({ ...loginInput, [name]: value });
  }
};

// Mutation
const [registerUser,{data:registerData, error:registerError, isLoading:registerIsLoading, isSuccess:registerIsSuccess}] = useRegisterUserMutation()
const [loginUser,{data:loginData, error:loginError, isLoading:loginIsLoading, isSuccess:loginIsSuccess}]= useLoginUserMutation()



// notifications 
useEffect(() => {
  if(registerIsSuccess && registerData){
    toast.success(registerData.message || "Signup successful.")
  }
  if(registerError){
    toast.error(registerError.data.message || "Signup Failed");
  }

  if(loginIsSuccess && loginData){
    toast.success(loginData.message || "Login successful.");
    navigate("/");
  }
  if(loginError){ 
    toast.error(loginError.data.message || "login Failed");
  }
}, [
  loginIsLoading,
  registerIsLoading,
  loginData,
  registerData,
  loginError,
  registerError,
]);

// get the dat from input field
const handleRegistration =  async(type) => {
  // console.log(signupInput); 
  // console.log(loginInput);
  const inputData = type === "signup" ? signupInput : loginInput;   //if type == signup assign inputData = signInput
  console.log(inputData);
  const action = type === "signup" ? registerUser : loginUser;
  await action(inputData); //we send the data according type if signup,send signupInput};

}
  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs defaultValue="Login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="SignUp">SignUp</TabsTrigger>
        <TabsTrigger value="Login">Login</TabsTrigger>
      </TabsList>
      <TabsContent value="SignUp">
        <Card>
          <CardHeader>
            <CardTitle>SignUp</CardTitle>
            <CardDescription>
            Create a new account and click signup when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. Aditya"
                  required="true"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. aditya@gmail.com"
                  required="true"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Eg. xyz@000"
                  required="true"
                />
              </div>
            </CardContent>
          <CardFooter>
          <Button
                disabled={registerIsLoading}
                onClick={() => handleRegistration("signup")}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Signup"
                )}  
              </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="Login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
            Login your password here. After signup, you'll be logged in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. aditya@gmail.com"
                  required="true"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. xyz@000"
                  required="true"
                />
              </div>
            </CardContent>
          <CardFooter>
            <Button
            disabled = {loginIsLoading}
            onClick={() => handleRegistration("login")}

            >
              {
                loginIsLoading ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                  </>
                ) : (
                  "Login"
                )
              }
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  )

}
export default Login