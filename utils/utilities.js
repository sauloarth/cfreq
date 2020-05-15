exports.randomNumber = length => {
    let text = '';
    const possible = '123456789';

    for (let i = 0; i < length; i++) {
        const top = Math.floor(Math.random() * possible.length);
        text += i > 0 && top == i ? '0' : possible.charAt(top)
    }

    return Number(text);
}

exports.status = {
    DEVOLVIDA: 'devolvida',
    NAOE_NTREGUE: 'não entregue',
    RECEBIDA: 'recebida',
    CONFERIDA_E_ARQUIVADA: 'conferida e arquivada'
}

exports.meses = {
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