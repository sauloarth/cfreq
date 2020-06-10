import React, { forwardRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

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
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
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

export default function ListaDeptos() {

    const [deptos, setDeptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vinculacao, setVinculacao] = useState({})
    const [error, setError] = useState({})
    const history = useHistory();

    const columns = [
        { title: 'Codigo', field: 'codigo', width: 8 },
        { title: 'Descrição', field: 'descricao', width: 300 },
        { title: 'Sigla', field: 'sigla', width: 40 },
        { title: 'Vinculado à', field: 'vinculacao', lookup: vinculacao, width: 200 }
    ]

    const fetchDeptos = () => {
        setError({})
        return api.get('/depto')
            .then(data => {
                setDeptos(data.data.data);
                return data.data
            })
            .then(data => {
                const deptosVinculacao = data.data.reduce((result, depto) => {
                    result[depto['_id']] = depto.sigla
                    return result
                }, {})
                setVinculacao(deptosVinculacao)
            })
            .then(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchDeptos();
    }, [])

    const createDepto = (depto) => {
        return api.post('/depto', depto)
            .then(() => fetchDeptos())
            .catch(error => {
                const formatedError = errorFormatter(error)
                setError({ message: formatedError })
                setTimeout(() => setError({}), 7000)
            })
    }

    const updateDepto = (depto) => {
        return api.put(`/depto/${depto._id}`, depto)
            .then(() => fetchDeptos())
            .catch(error => {
                const formatedError = errorFormatter(error)
                setError({ message: formatedError })
                setTimeout(() => setError({}), 7000)
            })
    }

    const deleteDepto = (depto) => {
        return api.delete(`depto/${depto._id}`)
            .then(() => fetchDeptos())
            .catch(error => {
                const formatedError = errorFormatter(error)
                setError({ message: formatedError })
                setTimeout(() => setError({}), 7000)
            })
    }

    if (loading) { return <p>Carregando . . . </p> }
    return (
        <div>
            {error.message && <Feedback text={error.message} show={true} severity="error" />}
            <MaterialTable
                icons={tableIcons}
                title="Unidades"
                columns={columns}
                localization={
                    {
                        ...localization,
                        toolbar: {
                            searchPlaceholder: "Buscar unidade",
                            searchTooltip: "Buscar por unidade específica"
                        },
                        body: {
                            addTooltip: "Criar unidade",
                            editTooltip: "Editar dados da unidade",
                            deleteTooltip: "Desativar uma unidade",
                        },
                    }
                }
                options={{ pageSize: 10, emptyRowsWhenPaging: false }}
                actions={[{
                    icon: AssignmentIndIcon,
                    tooltip: 'Ver servidores da unidade',
                    onClick: (event, rowData) => history.push(`funcionarios`, rowData)
                }]}
                data={deptos}
                editable={{
                    onRowAdd: createDepto,
                    onRowUpdate: updateDepto,
                    onRowDelete: deleteDepto,
                }}
            />
        </div>
    );
}