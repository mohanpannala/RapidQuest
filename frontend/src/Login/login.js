import { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "../header";
import '../Registration/index.css';
import { Link } from "react-router-dom/cjs/react-router-dom.min";

class Login extends Component {

    handleCancelLogin = (event) => {
        event.preventDefault();
        this.props.history.push("/"); 
    }

    handleLogin = async (event) => {
        event.preventDefault();
    
        const username = event.target.username.value;
        const password = event.target.password.value;
        
        if (!username || !password) {
            alert('Please fill in both fields.');
            return;
        }

        const credentials = { username, password };

        try {
            const response = await fetch('https://rapid-quest-api.vercel.app/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
    
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert('Login successful');
                this.props.history.push('/');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Error during login. Please try again later.');
        }
    }

    render() {
        return (
            <div className="main-container">
                <Header />
                <div className="registration-container">
                    <h1>Login</h1>
                    <form className="form-container" onSubmit={this.handleLogin}>
                        <div className="fields-containers">
                            <label className="label" htmlFor="username">User Name</label>
                            <input 
                                className="input-field" 
                                id="username" 
                                name="username" 
                                type="text" 
                                placeholder="Enter your username"
                            />
                        </div>

                        <div className="fields-containers">
                            <label className="label" htmlFor="password">Password</label>
                            <input 
                                className="input-field" 
                                id="password" 
                                name="password" 
                                type="password" 
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="buttons-container">
                            <button className="form-button" type="submit">Login</button>
                            <button className="form-button" onClick={this.handleCancelLogin}>Cancel</button>
                        </div>

                        <p>Don't have an account? <Link to="/register">Register</Link></p>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);
