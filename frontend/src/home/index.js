import { Component } from "react";
import Header from "../header";
import './index.css'
import EmailBuilder from "../EmailBuilder/EmailBuilder";

class Home extends Component{
    render(){
        return(
            <div className='main-container'>
                <Header />
                <EmailBuilder />
            </div>
        )
    }
}

export default Home