import { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './index.css';

class Header extends Component {
  state = {
    tab: 'home',
    isLoggedIn: false, 
  };

  componentDidMount() {
    const token = localStorage.getItem('token'); 
    if (token) {
      this.setState({ isLoggedIn: true });
    }
  }

  
  handlingTabClicked = (id) => {
    this.setState({ tab: id });
    console.log(id);
  };

  
  toggleLoginStatus = () => {
    const { isLoggedIn } = this.state;
    if (isLoggedIn) {
      localStorage.removeItem('token'); 
      this.setState({ isLoggedIn: false });
      
      return <Redirect to="/" />;
    } else {
      return <Redirect to="/login" />;
    }
  };

  render() {
    const { tab, isLoggedIn } = this.state;
    return (
      <div className='header-container'>
        <Link to= {isLoggedIn ? "/" : "/login"} className='feature'>
          <h2>Email Builder</h2>
        </Link>
        <div className='features-container'>
          
          {isLoggedIn ? (
            <Link
              to='/login'
              className={`feature ${tab === 'logout' ? 'feature-selected' : ''}`}
              onClick={() => {
                this.handlingTabClicked('logout');
                this.toggleLoginStatus(); 
              }}
            >
              Logout
            </Link>
          ) : (
            <>
              <Link
                to='/login'
                className={`feature ${tab === 'login' ? 'feature-selected' : ''}`}
                onClick={() => this.handlingTabClicked('login')}
              >
                Login
              </Link>

              <Link
                to='/register'
                className={`feature ${tab === 'register' ? 'feature-selected' : ''}`}
                onClick={() => this.handlingTabClicked('register')}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Header;
