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
import api from '../services/api';
import Feedback from './Feedback';

import errorFormatter from '../services/errorFormatter';
import localization from '../services/materialTableProperties';


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
    const [error, setError] = useState({});
    const [info, setInfo] = useState({});
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
        3: 'conferido'
    }

    const anoAtual = new Date().getFullYear()
    const mesAtual = new Date().getMonth()
    const deptoAtual = props.funcionario.deptoAtual._id

    const columns = [
        { title: 'Ano', field: 'ano', width: 10, initialEditValue: anoAtual },
        { title: 'Mes', field: 'mes', width: 70, type: 'numeric', lookup: meses, initialEditValue: mesAtual },
        {
            title: 'Lotação do Ponto', field: 'depto',
            lookup: props.deptos, initialEditValue: deptoAtual, width: 100,
        },
        { title: 'Status', field: 'status', width: 80, lookup: status, initialEditValue: 0 },
        { title: 'Obsevação', field: 'observacao', width: 300 }
    ]

    const fetchPontos = () => {
        return api.get(`/funcionario/${props.funcionario._id}/ponto`)
            .then(data => {
                setPontos(data.data.data);
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchPontos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const createPonto = (ponto) => {
        return api.post(`/funcionario/${props.funcionario._id}/ponto`, ponto)
            .then(response => {
                setInfo({ message: response.data.message })
                setTimeout(() => setInfo({}), 5000)
            })
            .then(() => fetchPontos())
            .catch(error => {
                const formatedError = errorFormatter(error)
                setError({ message: formatedError })
                setTimeout(() => setError({}), 7000)
            })
    }

    const updatePonto = (ponto) => {
        return api.put(`/ponto/${ponto._id}`, ponto)
            .then(response => {
                setInfo({ message: response.data.message })
                setTimeout(() => setInfo({}), 5000)
            })
            .then(() => fetchPontos())
            .catch(error => {
                const formatedError = errorFormatter(error)
                setError({ message: formatedError })
                setTimeout(() => setError({}), 7000)
            })
    }

    const deletePonto = (ponto) => {
        return api.delete(`/ponto/${ponto._id}`)
            .then(response => {
                setInfo({ message: response.data.message })
                setTimeout(() => setInfo({}), 5000)
            })
            .then(() => fetchPontos())
            .catch(error => {
                const formatedError = errorFormatter(error)
                setError({ message: formatedError })
                setTimeout(() => setError({}), 7000)
            })
    }

    // if (loading) { return <p>Carregando . . . </p> }
    return (
        <div>
            {error.message && <Feedback text={error.message} show={true} severity="error" />}
            {info.message && <Feedback text={info.message} show={true} severity="success" />}
            <MaterialTable
                style={{ padding: 30, backgroundColor: '#f4f4f4' }}
                localization={
                    {
                        ...localization,
                        body: {
                            addTooltip: "Cadastrar Ponto"
                        }
                    }
                }
                icons={tableIcons}
                title="Pontos do Servidor"
                columns={columns}
                data={pontos}
                isLoading={loading}
                options={{ pageSize: 10, search: false, tableLayout: "fixed", addRowPosition: "first", padding: "dense", emptyRowsWhenPaging: false }}
                editable={{
                    onRowAdd: createPonto,
                    onRowUpdate: updatePonto,
                    onRowDelete: deletePonto
                }}
            />
        </div>
    );
}