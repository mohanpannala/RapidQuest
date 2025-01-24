import { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Header from "../header";
import './index.css';

class Register extends Component {

    handleCancelRegistration = (event) => {
        event.preventDefault(); 
        this.props.history.push("/login"); 
    }

    handleRegister = async (event) => {
        event.preventDefault();

        const username = event.target.username.value.trim();
        const email = event.target.email.value.trim();
        const password = event.target.password.value.trim();
        const confirmPassword = event.target.conformpassword.value.trim();

        if (!username || !email || !password || !confirmPassword) {
            alert('Please fill in all the fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const user = { username, email, password, conformPassword: confirmPassword };


        try {
            const response = await fetch('https://rapid-quest-three.vercel.app/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                this.props.history.push('/login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    render() {
        return (
            <div className="main-container">
                <Header />
                <div className="registration-container">
                    <h1>Registration</h1>
                    <form className="form-container" onSubmit={this.handleRegister}>
                        <div className="fields-containers">
                            <label className="label" htmlFor="username">User Name</label>
                            <input 
                                className="input-field" 
                                id="username" 
                                name="username"
                                type="text" 
                                placeholder="Enter the username"
                            />
                        </div>

                        <div className="fields-containers">
                            <label className="label" htmlFor="email">Email</label>
                            <input 
                                className="input-field" 
                                id="email" 
                                name="email"
                                type="email" 
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="fields-containers">
                            <label className="label" htmlFor="password">Password</label>
                            <input 
                                className="input-field" 
                                id="password" 
                                name="password"
                                type="password" 
                                placeholder="Enter the password"
                            />
                        </div>

                        <div className="fields-containers">
                            <label className="label" htmlFor="conformpassword">Confirm Password</label>
                            <input 
                                className="input-field" 
                                id="conformpassword" 
                                name="conformpassword"
                                type="password" 
                                placeholder="Confirm the password"
                            />
                        </div>

                        <div className="buttons-container">
                            <button className="form-button" type="submit">Register</button>
                            <button className="form-button" onClick={this.handleCancelRegistration}>Cancel</button>
                        </div>

                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(Register);
