import { createSlice } from "@reduxjs/toolkit"


const initialState={
    token:"",
    user:""
}

export const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        userRegisteration:(state,action)=>{
            state.token=action.payload.token
        },
        userLoggedIn:(state,action)=>{
            state.token=action.payload.token
            state.user=action.payload.user
        },
        userLoggedOut:(state,action)=>{
            state.token=""
            state.user=""
        }
    }
})

export const {userRegisteration,userLoggedIn,userLoggedOut}=authSlice.actions

export default authSlice.reducer