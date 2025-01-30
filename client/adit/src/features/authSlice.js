import { createSlice } from "@reduxjs/toolkit" ;


const initialState ={
    user:null,
    isAuthenticated:false
}

const authSlice = createSlice({
    name:"authSlice",
    initialState,
    reducers:{
       userLoggedIn: (state,action) =>{
        state.user = action.payload.user;
        state.isAuthenticated = true;
       },
       userLoggedOut: (state) => {
        state.user = null
        state.isAuthenticated = false;
       }
    }

});

export const {userLoggedIn,userLoggedOut} =authSlice.actions;
export default authSlice.reducer;
// userLoggedIn is a acton also when we dispatch something from here , it come here
// like userloggedIn({name:asdf}), now this whole object {na..}is inside the payload of user & 
// we set his in state .user or we update initial state of user from null to a object, & we also update the sate of aythenticaton,
// we send this all details from our login.jsx through disptcher to this SLice & tis update the things

// reducer have many action into it, & slicemenas say featire
// which have a name & initial State  & reducers
// in reducer we hae state & payload(a store in which w econtain data)