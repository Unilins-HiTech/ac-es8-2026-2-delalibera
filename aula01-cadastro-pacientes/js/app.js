// Array que guarda os pacientes cadastrados
const pacientes = [];

const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const contador = document.getElementById('contador-pacientes'); // Referência ao contador

function adicionarPaciente(nome, email, telefone, nascimento) {
    const novoPaciente = { nome, email, telefone, nascimento };
    pacientes.push(novoPaciente);
}

// NOVO: Função para calcular a idade
function calcularIdade(dataISO) {
    // Dividimos a data para criar um objeto Date sem problemas de fuso horário (UTC)
    const [ano, mes, dia] = dataISO.split('-');
    const dataNascimento = new Date(ano, mes - 1, dia);
    const hoje = new Date();

    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const diferencaMes = hoje.getMonth() - dataNascimento.getMonth();

    // Se o mês atual for anterior ao mês de nascimento, ou se for o mesmo mês mas o dia atual for anterior ao dia de nascimento, subtrai 1 ano
    if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }

    return idade;
}

function renderizarTabela() {
    tabela.innerHTML = ''; // lim
	// pa a tabela

    pacientes.forEach((paciente) => {
        const linha = document.createElement('tr');
        
        // Calcula a idade no momento da renderização
        const idade = calcularIdade(paciente.nascimento);

        linha.innerHTML = `
            <td>${paciente.nome}</td>
            <td>${paciente.email}</td>
            <td>${paciente.telefone}</td>
            <td>${formatarData(paciente.nascimento)}</td>
            <td>${idade} anos</td>
        `;

        tabela.appendChild(linha);
    });

    // NOVO: Atualiza o texto do contador
    contador.textContent = `Total de pacientes: ${pacientes.length}`;
}

function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

formulario.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value; 
    const nascimento = document.getElementById('nascimento').value;

    // NOVO: Verifica se o e-mail já existe no array usando o método 'some'
    const emailJaCadastrado = pacientes.some(paciente => paciente.email === email);
    
    if (emailJaCadastrado) {
        alert('Este e-mail já está cadastrado. Por favor, insira um e-mail diferente.');
        return; // O 'return' para a execução aqui e impede o cadastro
    }

    adicionarPaciente(nome, email, telefone, nascimento);
    renderizarTabela();

    formulario.reset();
});