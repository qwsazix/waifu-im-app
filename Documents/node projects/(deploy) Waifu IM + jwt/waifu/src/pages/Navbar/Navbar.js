import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import './Navbar.css';
import { Sun, Moon } from 'lucide-react';


const Navbar = ({ onToggleTheme, theme }) => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const isAuth = !!token;

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary"
      data-bs-theme={theme}>
      <div className="container-fluid">
        <a
          href="https://docs.waifu.im/"
          className="navbar-brand"
          target="_blank"
          rel="noreferrer"
        >
          Waifu.im
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item">
              <button className='theme-toggle' onClick={onToggleTheme} title='Change theme'>
                {theme === 'dark' ? <Sun color='white' /> : <Moon color='black'/>}
              </button>
            </li>

            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            {isAuth ? (
              <>
                <li className="nav-item">
                  <Link to="/cabinet" className="nav-link">
                    Cabinet
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="nav-link btn btn-link"
                    style={{ textDecoration: "none" }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/signin" className="nav-link">
                    Sign In
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/signup" className="nav-link fw-semibold">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
