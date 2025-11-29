(function () {
  const info = document.getElementById('infoAluno');
  const card = document.getElementById('cardPontuacao');

  const alunoRA = localStorage.getItem('alunoRA');
  const alunoNome = localStorage.getItem('alunoNome') || '';

  if (!alunoRA) {
    alert('Você precisa entrar com seu RA antes de acessar esta página.');
    window.location.href = 'entrar.html';
    return;
  }

  function classificar(total) {
    if (total <= 5) return { rotulo: 'Iniciante', classe: 'iniciante' };
    if (total <= 10) return { rotulo: 'Regular', classe: 'regular' };
    if (total <= 20) return { rotulo: 'Ativo', classe: 'ativo' };
    return { rotulo: 'Extremo', classe: 'extremo' };
  }

  async function carregarPontuacao() {
    try {
      const res = await fetch(`http://localhost:3000/alunos/${encodeURIComponent(alunoRA)}`);
      if (!res.ok) throw new Error('Falha ao buscar aluno');
      const aluno = await res.json();

      const total = Number(aluno.total_lidos || 0);
      const { rotulo, classe } = classificar(total);

      info.innerHTML = `
        <p><strong>Aluno:</strong> ${alunoNome || aluno.nome}</p>
        <p><strong>RA:</strong> ${alunoRA}</p>
      `;

      card.innerHTML = `
        <div class="valor">${total} ${total === 1 ? 'livro' : 'livros'}</div>
        <div><span class="badge ${classe}">${rotulo}</span></div>
      `;
    } catch (err) {
      info.innerHTML = `<p style="color:#ef4444">Erro ao carregar pontuação. Tente novamente.</p>`;
    }
  }

  carregarPontuacao();
})();
