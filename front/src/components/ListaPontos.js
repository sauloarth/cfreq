import React, { forwardRef, useState, useEffect } from 'react';
import MaterialTable from 'material-table';

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

export default function ListaPontos(props) {
    const [pontos, setPontos] = useState([]);
    const [loading, setLoading] = useState(true);
    const meses = {
        0: 'Janeiro',
        1: 'Fevereiro',
        2: 'Março',
        3: 'Abril',
        4: 'Maio',
        5: 'Junho',
        6: 'Julho',
        7: 'Agosto',
        8: 'Setembro',
        9: 'Outubro',
        10: 'Novembro',
        11: 'Dezembro'
    }

    const status = {
        0: 'não entregue',
        1: 'devolvido',
        2: 'recebido',
        3: 'conferido e arquivado'
    }

    const columns = [
        { title: 'Ano', field: 'ano', width: 4, inicialEditValue: (new Date().getFullYear()) },
        { title: 'Mes', field: 'mes', width: 4, type: 'numeric', lookup: meses, inicialEditValue: (new Date().getFullYear()) },
        {
            title: 'Lotação do Ponto', field: 'depto._id',
            lookup: props.deptos, inicialEditValue: props.funcionario.deptoAtual._id, maxWidth: 300
        },
        { title: 'Status', field: 'status', width: 70, lookup: status, inicialEditValue: 0 },
        { title: 'Obsevação', field: 'observacao', width: 200 }
    ]




    const headers = new Headers({
        'Content-type': 'application/json',
        'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWJjNGM2MGRlMWNkMDUzZGRmNzcxZWIiLCJub21lIjoiVGVzdGVkYVNpbHZhIiwibWF0cmljdWxhIjoiMTIzNDU2NyIsImVtYWlsIjoic2F1bG9hcnRoQGdtYWlsLmNvbSIsImlhdCI6MTU4OTQ1NDMwNywiZXhwIjoxNTg5NDk3NTA3fQ.AY_7WiQkLWg_8VjsiOevxzAMLwo-8ud1SpLJy9lZKOU'
    })

    const fetchPontos = () => {
        return fetch(`http://localhost:3000/api/funcionario/${props.funcionario._id}/ponto`, { headers })
            .then(response => response.json())
            .then(data => {
                setPontos(data.data);
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchPontos();
    }, [])

    const createPonto = (ponto) => {
        return fetch(`http://localhost:3000/api/funcionario/${props.funcionario._id}/ponto`,
            {
                headers,
                method: 'post',
                body: JSON.stringify(ponto)
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .then(fetchPontos());
    }

    const updatePonto = (ponto) => {
        return fetch(`http://localhost:3000/api/ponto/${ponto._id}`,
            {
                headers,
                method: 'put',
                body: JSON.stringify(ponto)
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .then(fetchPontos());
    }

    const deletePonto = (ponto) => {
        return fetch(`http://localhost:3000/api/ponto/${ponto._id}`,
            {
                headers,
                method: 'delete',
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .then(fetchPontos());
    }

    if (loading) { return <p>Carregando . . . </p> }
    return (
        <MaterialTable
            style={{ padding: 30, backgroundColor: '#f4f4f4' }}
            options={{ search: false }}

            icons={tableIcons}
            title="Pontos do Servidor"
            columns={columns}
            data={pontos}
            editable={{
                onRowAdd: createPonto,
                onRowUpdate: updatePonto,
                onRowDelete: deletePonto
            }}
        />
    );
}