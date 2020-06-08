import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import ListaFuncionarios from '../components/ListaFuncionarios';
import ListaDeptos from '../components/ListaDeptos';

export default function App() {
    const { path } = useRouteMatch();
    return (
        <>
            <div style={{ padding: 50 }}>
                <Route path={`${path}/departamentos`} render={(props) => <ListaDeptos {...props} />} />
                <Route path={`${path}/funcionarios`} render={(props) => <ListaFuncionarios {...props} />} />
            </div>
        </>
    )
}

