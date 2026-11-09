// ==========================================
// app.js - Cadastro de Pacientes
// ==========================================

// Variáveis globais para os contadores de origem
let contadorJson = 0;
let contadorManual = 0;

// Capturando os elementos do DOM (HTML)
const tabela = document.querySelector("#tabela-pacientes");
const areaMensagem = document.querySelector("#mensagem-usuario");
const spanContadorJson = document.querySelector("#contador-json");
const spanContadorManual = document.querySelector("#contador-manual");
const formAdicionar = document.querySelector("#form-adiciona");

// Função auxiliar para criar e inserir uma linha na tabela
function adicionarPacienteNaTabela(paciente) {
    const tr = document.createElement("tr");

    // Cria as colunas (você pode adaptar de acordo com as chaves do seu JSON)
    tr.innerHTML = `
        <td>${paciente.nome}</td>
        <td>${paciente.peso}</td>
        <td>${paciente.altura}</td>
        <td>${paciente.gordura}</td>
        <td>${paciente.imc}</td>
    `;
    
    tabela.appendChild(tr);
}

// Função principal de busca (Assíncrona)
async function buscarPacientes() {
    // 1. Preparação e exibição de carregamento
    tabela.innerHTML = "";
    areaMensagem.textContent = "Carregando pacientes...";
    areaMensagem.style.color = "blue";

    try {
        // 2. Simulação de Latência (1 segundo)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Busca dos dados via Fetch
        const resposta = await fetch("data/pacientes.json");

        // Verifica se houve erro de rota (ex: Erro 404)
        if (!resposta.ok) {
            throw new Error(`Arquivo não encontrado (Status: ${resposta.status})`);
        }

        // Converte a resposta para JSON
        const pacientes = await resposta.json();

        // 4. Tratamento de Lista Vazia
        if (pacientes.length === 0) {
            areaMensagem.textContent = "Nenhum paciente cadastrado ainda.";
            areaMensagem.style.color = "orange";
            return; // Encerra a função aqui
        }

        // Remove a mensagem de carregamento se deu tudo certo
        areaMensagem.textContent = "";

        // Adiciona cada paciente retornado na tabela
        pacientes.forEach(paciente => {
            adicionarPacienteNaTabela(paciente);
        });

        // 5. Atualiza o contador de origem JSON
        contadorJson += pacientes.length;
        if (spanContadorJson) spanContadorJson.textContent = contadorJson;

    } catch (erro) {
        // 6. Tratamento de Erro Amigável para o Usuário
        areaMensagem.textContent = `Poxa, não foi possível carregar os dados: ${erro.message}`;
        areaMensagem.style.color = "red";
    }
}

// Lógica de cadastro manual de novos pacientes
formAdicionar.addEventListener("submit", function(event) {
    event.preventDefault(); // Evita o recarregamento padrão da página

    // Captura os dados digitados
    const pacienteAdicionado = {
        nome: formAdicionar.nome.value,
        peso: formAdicionar.peso.value,
        altura: formAdicionar.altura.value,
        gordura: formAdicionar.gordura.value,
        imc: (formAdicionar.peso.value / (formAdicionar.altura.value * formAdicionar.altura.value)).toFixed(2)
    };

    // Insere o novo paciente na tela
    adicionarPacienteNaTabela(pacienteAdicionado);

    // Atualiza o contador de origem Manual
    contadorManual++;
    if (spanContadorManual) spanContadorManual.textContent = contadorManual;

    // Limpa os campos do formulário para o próximo cadastro
    formAdicionar.reset();
});

// Inicia o processo de busca assim que o script for lido
buscarPacientes();