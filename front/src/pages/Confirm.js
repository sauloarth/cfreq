import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import api from "../services/api";


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                Cfreq - Controle de Frequência
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
}));

function CompleteRegistry(props) {
    const classes = useStyles();
    const [confirmed, setConfirmed] = useState(false)
    const history = useHistory()

    const confirmEmail = () => {
        const { code, email } = props.match.params

        api.post('/auth/confirm', { email, opt: code })
            .then(response => {
                if (response.status === 200) {
                    setConfirmed(true)
                    setTimeout(() => {
                        history.replace('/')
                    }, 4000)
                }
            })
            .catch(error =>
                history.replace('/confirmationError', { message: error.response.data.message })
            )
    }

    const handleComplete = () => {
        history.replace('/');
    }

    useEffect(() => {
        confirmEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!confirmed)
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" align="center">
                        Confirmando email. Aguarde ...
                </Typography>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        );

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" align="center">
                    Email confirmado.
                </Typography>
                <Link style={{ paddingTop: 50 }} onClick={handleComplete} href="#" variant="body2">
                    {"Faça login"}
                </Link>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );

}

export default withRouter(CompleteRegistry)