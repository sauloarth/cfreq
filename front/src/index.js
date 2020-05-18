import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MenuSuperior from './components/MenuSuperior';
import ListaFuncionarios from './components/ListaFuncionarios';

ReactDOM.render(
  <React.StrictMode>
    <div style={{ padding: 50 }}>
      <MenuSuperior />
      <ListaFuncionarios />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
