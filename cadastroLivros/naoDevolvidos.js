async function carregarRelatorio() {
  const tabela = document.getElementById("tabelaRelatorio");
  tabela.innerHTML = "<tr><td colspan='5'>Carregando...</td></tr>";

  try {
    const resposta = await fetch("http://localhost:4000/relatorio/nao-devolvidos");

    const dados = await resposta.json();

    tabela.innerHTML = "";

    if (dados.length === 0) {
      tabela.innerHTML = "<tr><td colspan='5'>Nenhum livro pendente.</td></tr>";
      return;
    }

    dados.forEach(item => {
      const linha = `
        <tr>
          <td>${item.ra_aluno}</td>
          <td>${item.codigo_livro}</td>
          <td>${new Date(item.data_retirada).toLocaleString()}</td>
        </tr>
      `;
      tabela.innerHTML += linha;
    });

  } catch (erro) {
    tabela.innerHTML = "<tr><td colspan='5'>Erro ao carregar dados.</td></tr>";
  }
}

document.getElementById("btnAtualizar").addEventListener("click", carregarRelatorio);

// carregar automaticamente ao abrir a página
carregarRelatorio();
