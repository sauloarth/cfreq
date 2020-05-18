import React, { forwardRef, useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import ListaPontos from './ListaPontos';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { render } from 'react-dom';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default function ListaFuncionarios() {

    const [funcionarios, setFuncionarios] = useState([]);
    const [deptos, setDeptos] = useState({});
    const [loading, setLoading] = useState(true);

    const columns = [
        { title: 'Matricula', field: 'matricula', width: 8 },
        { title: 'Nome', field: 'nome', width: 200 },
        { title: 'Lotação Atual', field: 'deptoAtual._id', lookup: deptos, width: 300 }
    ]

    const headers = new Headers({
        'Content-type': 'application/json',
        'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWJjNGM2MGRlMWNkMDUzZGRmNzcxZWIiLCJub21lIjoiVGVzdGVkYVNpbHZhIiwibWF0cmljdWxhIjoiMTIzNDU2NyIsImVtYWlsIjoic2F1bG9hcnRoQGdtYWlsLmNvbSIsImlhdCI6MTU4OTQ1NDMwNywiZXhwIjoxNTg5NDk3NTA3fQ.AY_7WiQkLWg_8VjsiOevxzAMLwo-8ud1SpLJy9lZKOU'
    })

    const fetchFuncionarios = () => {
        return fetch('http://localhost:3000/api/funcionario', { headers })
            .then(response => response.json())
            .then(data => {
                setFuncionarios(data.data);
                setLoading(false)
            })
    }

    const fetchDeptos = () => {
        return fetch('http://localhost:3000/api/depto', { headers })
            .then(response => response.json())
            .then(data => {
                console.log('Data deptos: ', data.data)
                let objectDeptos = data.data.reduce((result, depto) => {
                    result[depto['_id']] = depto.descricao
                    return result
                }, {})
                console.log(objectDeptos)
                return objectDeptos
            })
            .then(data => setDeptos(data))
            .then(console.log('Depto', deptos))
    }

    useEffect(() => {
        fetchFuncionarios();
        fetchDeptos();
    }, [])

    const createFuncionario = (funcionario) => {
        return fetch('http://localhost:3000/api/funcionario',
            {
                headers,
                method: 'post',
                body: JSON.stringify(funcionario)
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .then(fetchFuncionarios())
    }

    const updateFuncionario = (funcionario) => {
        return fetch(`http://localhost:3000/api/funcionario/${funcionario._id}`,
            {
                headers,
                method: 'put',
                body: JSON.stringify(funcionario)
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .then(fetchFuncionarios())
    }

    const deleteFuncionario = (funcionario) => {
        return fetch(`http://localhost:3000/api/funcionario/${funcionario._id}`,
            {
                headers,
                method: 'delete',
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .then(fetchFuncionarios())
    }

    if (loading) { return <p>Carregando . . . </p> }
    return (
        <MaterialTable
            icons={tableIcons}
            title="Servidores - Lotação"
            columns={columns}
            data={funcionarios}
            onRowClick={(event, rowData, togglePanel) => togglePanel(event)}
            editable={{
                onRowAdd: createFuncionario,
                onRowUpdate: updateFuncionario,
                onRowDelete: deleteFuncionario
            }}
            detailPanel={rowData => (<ListaPontos funcionario={rowData} deptos={deptos} />)}
        />
    );
}
