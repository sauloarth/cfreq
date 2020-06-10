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
import api from '../services/api';
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

export default function ListaFuncionarios() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deptos, setDeptos] = useState({});

    const pageSize = 10
    const page = 0

    const columns = [
        { title: 'Matricula', field: 'matricula', width: 8 },
        { title: 'Nome', field: 'nome', width: 200 },
        { title: 'Lotação Atual', field: 'deptoAtual._id', lookup: deptos, width: 300 }
    ]

    const isLetter = (str) => {
        return str.length === 1 && str.match(/[a-z]/i);
    }

    const handleChangeSearchText = text => {
        if (text.length && isLetter(text.charAt(0))) {
            if (text.length >= 4) {
                setLoading(true)
                fetchFuncionarios(text)
            }
        }

        // eslint-disable-next-line 
        if (text.length && (text.charAt(0) == 0 || 1 || 2)) {
            if (text.length && text.length >= 8) {
                setLoading(true)
                fetchFuncionarios(text)
            }
        }

        if (text.lenght < 4) {
            setFuncionarios([])
        }
    }

    const fetchFuncionarios = (text) => {
        return api.get(`/funcionario?busca=${text}&page=${page}pageSize=${pageSize}`)
            .then(data => {
                setFuncionarios(data.data.data);
                setLoading(false)
            })
    }

    const fetchDeptos = () => {
        return api.get('/depto')
            .then(data => {
                let objectDeptos = data.data.data.reduce((result, depto) => {
                    result[depto['_id']] = depto.sigla
                    return result
                }, {})
                return objectDeptos
            })
            .then(data => setDeptos(data))
    }


    useEffect(() => {
        setLoading(false)
        fetchDeptos()
    }, [])

    const createFuncionario = (funcionario) => {
        return api.post('/funcionario', funcionario)
            .then(() => fetchFuncionarios())
    }

    const updateFuncionario = (funcionario) => {
        return api.put(`/funcionario/${funcionario._id}`, funcionario)
            .then(() => fetchFuncionarios())
    }

    const deleteFuncionario = (funcionario) => {
        return api.delete(`/funcionario/${funcionario._id}`)
            .then(() => fetchFuncionarios())
    }

    return (
        <MaterialTable
            icons={tableIcons}
            title="Digite o nome do servidor para buscar"
            columns={columns}
            onSearchChange={(text) => handleChangeSearchText(text)}
            localization={
                {
                    ...localization,
                    toolbar: {
                        searchPlaceholder: "Buscar por funcionario",
                        searchTooltip: "Buscar por funcionario específico na unidade"
                    },
                    body: {
                        addTooltip: "Cadastrar funcionario",
                        editTooltip: "Editar dados do funcionario",
                        deleteTooltip: "Desativar um funcionario",
                    },
                }
            }
            data={funcionarios}
            isLoading={loading}
            options={{ pageSize, debounceInterval: 800, emptyRowsWhenPaging: false }}
            editable={{
                onRowAdd: createFuncionario,
                onRowUpdate: updateFuncionario,
                onRowDelete: deleteFuncionario
            }}
            detailPanel={rowData => (<ListaPontos funcionario={rowData} deptos={deptos} />)}
        />
    );
}
