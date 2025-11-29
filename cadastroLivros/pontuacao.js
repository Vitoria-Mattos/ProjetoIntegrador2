async function carregarPontuacao() {
    try {
        const resposta = await fetch("http://localhost:4000/pontuacao");
        const dados = await resposta.json();

        // Criar listas vazias para cada categoria
        const categorias = {
            iniciante: [],
            regular: [],
            ativo: [],
            extremo: []
        };

        // Separar alunos por categoria
        dados.forEach(a => {
            const categoria = a.categoria?.toLowerCase() || "iniciante";
            categorias[categoria].push(a);
        });

        // Preencher as listas na tela
        preencher("iniciante", categorias.iniciante);
        preencher("regular", categorias.regular);
        preencher("ativo", categorias.ativo);
        preencher("extremo", categorias.extremo);

    } catch (e) {
        console.error("Erro ao buscar dados:", e);
    }
}

function preencher(categoria, lista) {
    const ul = document.getElementById("lista-" + categoria);
    ul.innerHTML = "";

    if (!lista || lista.length === 0) {
        ul.innerHTML = `<li>Nenhum aluno nesta categoria.</li>`;
        return;
    }

    // Mostrar nome, RA e livros lidos
    lista.forEach(a => {
        ul.innerHTML += `
            <li>
                <strong>${a.nome}</strong> — RA: ${a.ra}<br>
                Livros lidos: ${a.livros_lidos}
            </li>
        `;
    });
}

carregarPontuacao();
