async function carregarLivros() {
  const tabela = document.querySelector('#tabelaLivros tbody');
  const boasVindas = document.getElementById('boasVindas');

  // Recupera o aluno logado
  const alunoNome = localStorage.getItem('alunoNome');
  const alunoRA = localStorage.getItem('alunoRA');

  if (!alunoRA) {
    alert('Você precisa entrar com seu RA antes de acessar esta página.');
    window.location.href = 'entrar.html';
    return;
  }

  // Mostra mensagem personalizada
  boasVindas.textContent = `Bem-vindo(a), ${alunoNome}!`;

  tabela.innerHTML = '<tr><td colspan="7">Carregando...</td></tr>';

  try {
    const res = await fetch('http://localhost:3000/livros/disponiveis');
    const livros = await res.json();

    if (!res.ok) {
      tabela.innerHTML = `<tr><td colspan="7">Erro ao carregar livros.</td></tr>`;
      return;
    }

    if (livros.length === 0) {
      tabela.innerHTML = `<tr><td colspan="7">Nenhum livro disponível no momento.</td></tr>`;
      return;
    }

    tabela.innerHTML = '';
    livros.forEach(livro => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${livro.id}</td>
        <td>${livro.titulo}</td>
        <td>${livro.autor || '-'}</td>
        <td>${livro.editora || '-'}</td>
        <td>${livro.ano_publicacao || '-'}</td>
        <td>${livro.categoria || '-'}</td>
        <td>${livro.exemplares_disponiveis}</td>
      `;
      tabela.appendChild(tr);
    });
  } catch (error) {
    tabela.innerHTML = `<tr><td colspan="7">Falha na conexão com o servidor.</td></tr>`;
  }
}

carregarLivros();

// navegação para pontuação
const btnPontuacao = document.getElementById('btnPontuacao');
if (btnPontuacao) {
  btnPontuacao.addEventListener('click', () => {
    window.location.href = 'pontuacao.html';
  });
}

