import { redirect } from 'next/navigation'
import React from 'react'
import { useSelector } from 'react-redux'

type ProtectedProps = {
    children:React.ReactNode
}

const AdminProtected = ({children}: ProtectedProps) => {
    const {user}=useSelector((state:any)=>state.auth)

    const isAdmin=user?.role==="admin"
  return isAdmin?children:redirect("/")
}

export default AdminProtected