async function carregarAlunos() {
  const tabela = document.querySelector('#tabela tbody');
  tabela.innerHTML = '<tr><td colspan="7">Carregando...</td></tr>';

  try {
    const res = await fetch('http://localhost:3000/alunos');
    const alunos = await res.json();

    if (!res.ok) {
      tabela.innerHTML = `<tr><td colspan="7">Erro ao carregar alunos.</td></tr>`;
      return;
    }

    if (alunos.length === 0) {
      tabela.innerHTML = `<tr><td colspan="7">Nenhum aluno cadastrado.</td></tr>`;
      return;
    }

    tabela.innerHTML = '';
    alunos.forEach(aluno => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${aluno.id}</td>
        <td>${aluno.nome}</td>
        <td>${aluno.ra}</td>
        <td>${aluno.curso || '-'}</td>
        <td>${aluno.email || '-'}</td>
        <td>${aluno.telefone || '-'}</td>
        <td>${new Date(aluno.data_cadastro).toLocaleString()}</td>
      `;
      tabela.appendChild(tr);
    });
  } catch (error) {
    tabela.innerHTML = `<tr><td colspan="7">Falha na conexão com o servidor.</td></tr>`;
  }
}

carregarAlunos();
