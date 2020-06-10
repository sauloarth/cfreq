import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { getNome, getMatricula, logout } from '../services/auth';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function SimpleMenu() {
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>

            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => { history.push('/app/departamentos'); handleClose() }}>Todas Unidades</MenuItem>
                <MenuItem onClick={() => { history.push('/app/buscaFuncionarios'); handleClose() }}>Buscar Funcionário</MenuItem>
            </Menu>
        </div >
    );
}

export default function MenuSuperior(props) {
    const classes = useStyles();
    const history = useHistory();
    const [state, setState] = useState({ nome: getNome(), matricula: getMatricula() });

    const handleSair = () => {
        setState({});
        logout();
        history.push('/')
    }

    return (
        <div style={{ padding: '50px 50px 0px 50px' }} className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <SimpleMenu />
                    <Typography variant="h6" className={classes.title}>
                        CFREQ - Controle de Frequências
          </Typography>
                    <><Button color="inherit">{`${state.nome} - ${state.matricula}`}</Button><Button color="inherit" onClick={handleSair}>Sair</Button></>
                </Toolbar>
            </AppBar>
        </div>
    );
}
