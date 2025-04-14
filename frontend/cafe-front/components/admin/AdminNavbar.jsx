import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import cafeLogo from '../../src/assets/logo.png';

const pages = [
  { name: 'Bookings', path: '/admin' },
  { name: 'Events', path: '/admin/edit-events' },
  { name: 'Pricing', path: '/admin/edit-pricing' },
  { name: 'Tables', path: '/admin/edit-tables' },
  { name: 'Hours', path: '/admin/edit-hours' }

];

function AdminNavbar() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = React.useState(i18n.language);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { isAuthenticated, isCheckingAuth, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const settings = isAuthenticated
    ? [
      ...(user?.role === 'admin' ? [{ name: 'UserView', path: '/' }] : []),
      { name: 'Logout', action: handleLogout }
    ]
    : [{ name: 'Sign In', path: '/sign-in' }];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const updateLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  if (isCheckingAuth) return null;

  return (
    <AppBar position="static" color="white">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Typography
            variant="h7"
            noWrap
            component={Link}
            to={user?.role === 'admin' ? '/admin' : '/'}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: "Fontdiner Swanky",
              fontWeight: 700,
              letterSpacing: '.3rem',
              fontSize: '1rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            <img src={cafeLogo} alt="Cafe Boardgame Logo" className="max-w-[90px]" />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="black"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" sx={{ fontFamily: 'Fontdiner Swanky' }}>
                    <Link to={page.path}>{t(`admin_navbar.${page.name}`)}</Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h7"
            noWrap
            component={Link}
            to={user?.role === 'admin' ? '/admin' : '/'}
            sx={{
              mr: 1,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: "Fontdiner Swanky",
              fontWeight: 400,
              letterSpacing: '.1rem',
              fontSize: '1rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            BOARDGAME
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 6 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'black', display: 'block', mr: 6, fontSize: '1.0rem', fontFamily: 'Fontdiner Swanky', ":hover": { bgcolor: 'white' } }}
                component={Link}
                to={page.path}
              >
                {t(`admin_navbar.${page.name}`)}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <i className="fa-solid fa-globe"></i>
            <select value={language} onChange={(e) => updateLanguage(e.target.value)} style={{  fontFamily: 'Fontdiner Swanky', marginLeft: '10px', marginRight: '20px', border: 'none', outline: 'none', backgroundColor: 'transparent', cursor: 'pointer', }}>
              <option value="en">EN</option>
              <option value="fi">FI</option>
            </select>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="BoardGame" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem key={index} onClick={setting.action || handleCloseUserMenu}>
                  <Typography textAlign="center" fontFamily={'Fontdiner Swanky'}>
                    {setting.path ? <Link to={setting.path}>{t(`admin_navbar.${setting.name}`)}</Link> : t(`admin_navbar.${setting.name}`)}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AdminNavbar;
