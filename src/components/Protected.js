import { Navigate } from "../react-router";


function Protected({component,path}){
    return localStorage.getItem('login')?
    component:<Navigate to="/login" state={{from:path}}/>
}

export default Protected;