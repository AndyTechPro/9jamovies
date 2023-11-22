import './App.css';
import {Routes, Route} from "react-router-dom";
import Header from './header';
import Header_Adminlogin from './Header_admin-login';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import AdminDashboard from './Pages/AdminDashboard';
import { UserContextProvider } from './UserContext';
import CreatePost from './Pages/CreatePost';
import PostPage from './Pages/PostPage';
import EditPost from './Pages/EditPost';


function App() {
  return (
    
    <UserContextProvider>
    <Routes>
      <Route index element={
        
            <HomePage />
            
            
      
      } /> 
      <Route path="/post/:id" element={
        <>
          < Header />
          <PostPage />
          </>
        } />
      <Route path="/admin" element={
        <main className="container">
           <Header_Adminlogin />
            <LoginPage />
        </main>
        } />
        <Route path="/adminReg" element={
        <main className="container">
           <Header_Adminlogin />
            <RegisterPage />
        </main>
        } />
         <Route path="/AdminDashboard" element={
        <main className="container">
          <Header_Adminlogin />
           <AdminDashboard />
        </main>
        } />
        <Route path="/create" element={
        <main className="container">
          <Header_Adminlogin />
           <CreatePost />
        </main>
        } />
         <Route path="/edit-post/:id" element={
        <main className="container">
          <Header_Adminlogin />
           <EditPost />
        </main>
        } />
    </Routes>
    </UserContextProvider>

    
  );
}

export default App;
