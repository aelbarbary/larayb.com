import React, { Component } from 'react';
import logo from '../../assets/images/logo.png'
import firebase, { auth, googleProvider, facebookProvider } from '../../lib/firebase.js';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

const styles = theme => ({

  headerRoot:{
    margin: 0,
    display: 'flex',
  },
  appBar:{
    backgroundColor: 'black',
    zIndex: theme.zIndex.drawer + 1,
  },
  logo:{
    width: 30,
    height: 30,
    margin: 5,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  description: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    fontWeight: 'normal',
    marginLeft:40,
    color: '#cccccc'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'white',
    width: '100%',
    fontWeight: 'bold',
    fontColor: 'white',
    backgroundColor: '#3CBC8D'

  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
    fontSize: 16
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  button: {
    margin: theme.spacing.unit,
    color: 'white'
  },
});


class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
      desktopLoginAnchorEl: null,
      query: ''
    };
    this.googleLogin = this.googleLogin.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null});
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null, mobileOpen: false });
  };

  handleQueryChange = event => {
    const query =  event.target.value;
    this.setState({ query: query });
  };

  handleKeyPress = (e) => {

    if (e.key === 'Enter') {
      this.props.history.push({
          pathname: `/search/${this.state.query}/`
        })
    }
  }

  handleDesktopLoginClick = event => {
    this.setState({ desktopLoginAnchorEl: event.currentTarget });
  };

  handleDesktopLoginClose = () => {
    this.setState({ desktopLoginAnchorEl: null });
  };

  componentWillMount(){
    if (window.location.pathname.includes("search")){
      const search =  window.location.pathname.split("/")[2];
      if (search !== ""){
        this.setState({query: search})
      }
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  getUser(){
    if (this.state.user){
      const {user} = this.state;
      return {
        userId: user.uid,
        image: user.photoURL
      }
    }
    return null;
  }

  logout() {
    auth.signOut()
    .then(() => {
      this.setState({
        user: null,
        anchorEl: null,
        mobileOpen: null,
        mobileMoreAnchorEl: null
      });
    });
  }

  googleLogin() {
    auth.signInWithPopup(googleProvider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user,
          anchorEl: null,
          mobileOpen: null,
          mobileMoreAnchorEl: null
        });
      });
  }

  facebookLogin() {
    auth.signInWithPopup(facebookProvider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user,
          anchorEl: null,
          mobileOpen: null,
          mobileMoreAnchorEl: null
        });
      });
  }


  render() {

    const { anchorEl, mobileMoreAnchorEl, desktopLoginAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={this.handleMenuClose}>
          <MenuItem component={Link}
            to={{
                pathname: `/myaccount/`,
                state: {
                        user: this.getUser()
                      }
              }}
            onClick={this.handleMenuClose}>
              My Account
          </MenuItem>
          <MenuItem component={Link}
            to={{
                pathname: `/offer/`,
                state: {
                        user: this.getUser(),
                      }
              }}
            onClick={this.handleMenuClose}>
            Create an offer
          </MenuItem>
          <MenuItem onClick={this.logout}>Logout</MenuItem>
        </Menu>
      );

      const renderMobileMenu = (
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMobileMenuOpen}
          onClose={this.handleMobileMenuClose}
        >

        {this.state.user ?
          <div>
            <MenuItem component={Link}
              to={{
                  pathname: `/myaccount/`,
                  state: {
                          user: this.getUser()
                        }
                }}
              onClick={this.handleMenuClose}
              >
                My Account
            </MenuItem>
            <MenuItem component={Link}
              to={{
                  pathname: `/offer/`,
                  state: {
                          user: this.getUser()
                        }
                }}
              onClick={this.handleMenuClose}
              >
              Create an offer
            </MenuItem>
            <MenuItem onClick={this.logout}>Logout</MenuItem>
          </div>
          :
          <MenuItem>
                <GoogleLoginButton onClick={this.googleLogin} style={{width:200, fontSize: 14}}/>
                <FacebookLoginButton onClick={this.facebookLogin} style={{width:200, fontSize: 14}}/>
          </MenuItem>

        }
        </Menu>
      );


    return (
      <div className={classes.headerRoot}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer" component={Link} to="/">
              <img src={logo} width='30px' height='30px' alt='logo' className={classes.logo}></img>
            </IconButton>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap component={Link} to="/">
              LARAYB
            </Typography>

            <Typography className={classes.description} variant="h6" color="inherit" noWrap>
              Islamic Events, Products and Services in WA State
            </Typography>

            <div className={classes.grow} />

            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                value={this.state.query}
                onChange={this.handleQueryChange}
                onKeyPress={this.handleKeyPress}
              />
            </div>

            <div className={classes.sectionDesktop}>

              {this.state.user ?
                <IconButton
                  aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleProfileMenuOpen}
                  color="inherit"
                >
                  <div>
                    <div className='user-profile'>
                      <Avatar alt="" src={this.state.user.photoURL}  className='avatar' />
                    </div>
                  </div>
                </IconButton>
                :
                  <div>
                    <Button className={classes.button} onClick={this.handleDesktopLoginClick}>
                      Login
                    </Button>
                    <Menu
                      id="simple-menu"
                      anchorEl={desktopLoginAnchorEl}
                      open={Boolean(desktopLoginAnchorEl)}
                      onClose={this.handleDesktopLoginClose}
                    >
                      <MenuItem onClick={this.handleDesktopLoginClose}>
                          <GoogleLoginButton onClick={this.googleLogin} style={{width:200, fontSize: 14}}/>
                          <FacebookLoginButton onClick={this.facebookLogin} style={{width:200, fontSize: 14}}/>
                      </MenuItem>
                    </Menu>
                  </div>
              }


            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Header));
