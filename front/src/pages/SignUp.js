import React, { useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import api from '../services/api';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function SignUp() {
    const classes = useStyles();
    const [state, setState] = useState({});
    const history = useHistory();

    const handleChange = (event) => {
        event.preventDefault()
        const name = event.target.name
        const value = event.target.value
        setState((prev) => {
            return { ...prev, ...{ [name]: [value] } }
        })
    }

    const handleSignUp = async (event) => {
        event.preventDefault();
        const { nome, matricula, email, password } = state

        if (!nome || !matricula || !email || !password) {
            setState((prev) => {
                return { ...prev, ...{ error: 'Você precisa preencher todos os dados.' } }
            })
        } else {
            try {
                await api.post('/auth/register', { matricula, nome, email, password });
                history.replace('/complete');
            } catch (error) {
                console.log(error)
                setState((prev) => {
                    return { ...prev, ...{ error: 'Erro ao registrar.' } }
                })
            }

        }
    }

    const handleLogar = () => {
        history.replace('/')
    }


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Registre-se
        </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="nome"
                        label="Nome"
                        name="nome"
                        autoComplete="nome"
                        autoFocus
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="matricula"
                        label="Matrícula"
                        name="matricula"
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Lembrar de mim"
                    />
                    <Button
                        onClick={handleSignUp}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Registrar
          </Button>
                    <Grid container>
                        <Grid item xs>

                        </Grid>
                        <Grid item>
                            <Link onClick={handleLogar} href="#" variant="body2">
                                {"Já é registrado? Faça login aqui!"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}

export default withRouter(SignUp)