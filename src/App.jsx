import React from "react"
import { Routes, Route } from "react-router-dom"
import { Welcome, Home, Inbox, Error, Profile } from './pages'
import { AuthRequired, PlayerManager, SideMenu } from "./components"

export default function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/error" element={<Error />} />
        <Route path="/" element={<AuthRequired />}>
            <Route path="/:songId?" element={<PlayerManager />}>
              <Route element={<SideMenu />}>
                <Route index element={<Home />}/> 
                <Route path="inbox:userId" element={<Inbox />}/> 
                <Route path="account:userId" element={<Profile />}/> 
              </Route>
            </Route>
        </Route>
    </Routes>
  )
}