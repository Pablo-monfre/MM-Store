let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let produtos = [];

// Função para carregar produtos do arquivo JSON
function carregarProdutos() {
    fetch('produtos.json')
        .then(response => response.json())
        .then(data => {
            produtos = data; // Armazena os produtos em uma variável global
            exibirProdutos(produtos); // Exibe todos os produtos inicialmente
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
        });
        
}

function carregarProdutosEmDestaque() {
    fetch('produtos.json')
        .then(response => response.json())
        .then(data => {
            produtos = data; // Armazena os produtos em uma variável global
            exibirProdutosEmDestaque(produtos); // Exibe produtos em destaque
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
        });
}

function exibirProdutosEmDestaque(produtos) {
    const container = document.getElementById("featured-products");
    container.innerHTML = ""; // Limpa o container

    const produtosEmDestaque = produtos.filter(produto => produto.destaque); // Filtra produtos em destaque

    produtosEmDestaque.forEach(produto => {
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML = `
    <div class="card mb-4">
        <img src="${produto.image}" class="card-img-top" alt="${produto.name}">
        <div class="card-body">
            <h5 class="card-title">${produto.name}</h5>
            <p class="font-weight-bold">R$ ${produto.price.toFixed(2)}</p>
            ${produto.quantity > 0 
                ? `<button class="btn btn-primary" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>` 
                : `<button class="btn btn-secondary" disabled>Produto Esgotado</button>`}
        </div>
    </div>
`;
        container.appendChild(col);
    });
}

// Função para exibir produtos na página
function exibirProdutos(produtos) {
    const container = document.getElementById("produtos");
    container.innerHTML = ""; // Limpa o container

    produtos.forEach(produto => {
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML = `
    <div class="card mb-4">
        <img src="${produto.image}" class="card-img-top" alt="${produto.name}">
        <div class="card-body">
            <h5 class="card-title">${produto.name}</h5>
            <p class="font-weight-bold">R$ ${produto.price.toFixed(2)}</p>
            ${produto.quantity > 0 
                ? `<button class="btn btn-primary" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>` 
                : `<button class="btn btn-secondary" disabled>Produto Esgotado</button>`}
        </div>
    </div>
`;
        container.appendChild(col);
    });
}

// Função para filtrar produtos com base na pesquisa
function filtrarProdutos() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const produtosFiltrados = produtos.filter(produto => 
        produto.name.toLowerCase().includes(searchTerm)
    );
    exibirProdutos(produtosFiltrados); // Exibe os produtos filtrados
}

//carrinho

// Função para carregar o carrinho do localStorage
function carregarCarrinho() {
    const carrinhoStorage = localStorage.getItem('carrinho');
    if (carrinhoStorage) {
        carrinho = JSON.parse(carrinhoStorage); // Carrega o carrinho do localStorage
    } else {
        carrinho = []; // Inicializa o carrinho como vazio se não houver dados
    }
    atualizarCarrinho(); // Atualiza a exibição do carrinho
}

// Função para adicionar quantidade de produto
function adicionarProduto(id) {
    const itemCarrinho = carrinho.find(item => item.id === id);
    const produto = produtos.find(p => p.id === id); // Encontra o produto correspondente

    if (itemCarrinho && produto) {
        if (itemCarrinho.quantidade < produto.quantity) {
            itemCarrinho.quantidade += 1; // Incrementa a quantidade
            localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza o localStorage
            atualizarCarrinho(); // Atualiza a visualização do carrinho
        } else {
            alert(`Não é possível adicionar mais ${produto.name}. Quantidade máxima disponível: ${produto.quantity}.`);
        }
    }
}

function atualizarCarrinho() {
    const carrinhoItens = document.getElementById("carrinho-itens");
    carrinhoItens.innerHTML = ""; // Limpa o conteúdo atual

    if (carrinho.length === 0) {
        document.getElementById("total").innerText = `Total: R$ 0,00`; // Define o total como zero
        return; // Sai da função se o carrinho estiver vazio
    }

    let total = 0; // Inicializa o total
    carrinho.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>
                <button onclick="removerProduto(${item.id})" class="btn btn-danger btn-sm">-</button>
                <span id="quantidade-produto-${item.id}">${item.quantidade}</span>
                <button onclick="adicionarProduto(${item.id})" class="btn btn-success btn-sm">+</button>
            </td>
            <td>R$ ${(item.price * item.quantidade).toFixed(2)}</td>
            <td><button onclick="removerDoCarrinho(${item.id})" class="btn btn-warning">Remover</button></td>
        `;
        carrinhoItens.appendChild(tr);
        total += item.price * item.quantidade; // Calcula o total
    });

    document.getElementById("total").innerText = `Total: R$ ${total.toFixed(2)}`; // Atualiza o total
}


// Função para remover quantidade de produto
function removerProduto(id) {
    const itemCarrinho = carrinho.find(item => item.id === id);
    if (itemCarrinho && itemCarrinho.quantidade > 0) {
        itemCarrinho.quantidade -= 1; // Decrementa a quantidade
        if (itemCarrinho.quantidade === 0) {
            removerDoCarrinho(id); // Remove do carrinho se a quantidade for 0
        } else {
            localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza o localStorage
            atualizarCarrinho(); // Atualiza a visualização do carrinho
        }
    }
}

// Função para remover produtos do carrinho
function removerDoCarrinho(id) {
    const itemIndex = carrinho.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        carrinho.splice(itemIndex, 1); // Remove o item do carrinho
        localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza o localStorage
        atualizarCarrinho(); // Atualiza a visualização do carrinho
    }
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id); // Encontra o produto correspondente
    const itemCarrinho = carrinho.find(item => item.id === id); // Verifica se o item já está no carrinho

    if (itemCarrinho) {
        // Se o produto já está no carrinho, apenas incrementa a quantidade
        if (itemCarrinho.quantidade < produto.quantity) {
            itemCarrinho.quantidade += 1; // Incrementa a quantidade
        } else {
            alert(`Não é possível adicionar mais ${produto.name}. Quantidade máxima disponível: ${produto.quantity}.`);
        }
    } else {
        // Se o produto não está no carrinho, adiciona um novo item
        carrinho.push({ ...produto, quantidade: 1 }); // Adiciona o produto com quantidade 1
        alert(`${produto.name} foi adicionado ao carrinho!`);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza o localStorage
    atualizarCarrinho(); // Atualiza a visualização do carrinho
}

window.onload = function() {
    carregarProdutos();
    carregarProdutosEmDestaque();
    carregarCarrinho();
};

// checkout

let currentStep = 1;

function nextStep(step) {
    // Esconde a etapa atual
    document.getElementById(`step${currentStep}`).classList.remove('active');
    // Mostra a próxima etapa
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add('active');
    // Carrega o resumo do pedido na etapa 2
    if (currentStep === 2) {
        carregarResumoPedido();
    }
}

function prevStep(step) {
    // Esconde a etapa atual
    document.getElementById(`step${currentStep}`).classList.remove('active');
    // Mostra a etapa anterior
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.add('active');
}

function validarEAvancar(step) {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const rua = document.getElementById("rua").value;
    const cidade = document.getElementById("cidade").value;
    const cep = document.getElementById("cep").value;

    // Verifica se todos os campos essenciais estão preenchidos
    if (!nome || !email || !telefone || !rua || !cidade || !cep) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    // Se tudo estiver correto, avança para a próxima etapa
    nextStep(step);
}

// Função para carregar o resumo do pedido
function carregarResumoPedido() {
    const carrinhoStorage = localStorage.getItem('carrinho');
    if (carrinhoStorage) {
        const carrinho = JSON.parse(carrinhoStorage);
        const resumoPedido = document.getElementById("resumo-pedido");
        resumoPedido.innerHTML = ""; // Limpa o conteúdo atual
        let total = 0;

        carrinho.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantidade}</td>
                <td>R$ ${(item.price * item.quantidade).toFixed(2)}</td>
            `;
            resumoPedido.appendChild(tr);
            total += item.price * item.quantidade; // Calcula o total
        });

        document.getElementById("total").innerText = `Total: R$ ${total.toFixed(2)}`; // Atualiza o total
    }
}

// Função para validar os dados de pagamento
function validarPagamento() {
    const numeroCartao = document.getElementById("numero-cartao").value;
    const dataExpiracao = document.getElementById("data-expiracao").value;
    const cvv = document.getElementById("cvv").value;

    if (!numeroCartao || !dataExpiracao || !cvv) {
        alert("Por favor, preencha todos os campos obrigatórios de pagamento.");
        return false;
    }

    alert("Compra finalizada com sucesso!"); // Mensagem de sucesso
    return true; // Retorna verdadeiro se tudo estiver correto
}

// Adicione um listener para o evento de submit do formulário
document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    if (validarPagamento()) {
        // Aqui você pode adicionar a lógica para processar a compra
        // Por exemplo, redirecionar para uma página de confirmação ou limpar o carrinho
        localStorage.removeItem('carrinho'); // Limpa o carrinho após a compra
        window.location.href = 'confirmacao.html'; // Redireciona para uma página de confirmação
    }
});

// Função para mostrar/ocultar campos de cartão com base na forma de pagamento selecionada
document.querySelectorAll('input[name="pagamento"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
        const dadosCartao = document.getElementById("dados-cartao");
        if (event.target.value === "cartao-credito" || event.target.value === "cartao-debito") {
            dadosCartao.style.display = "block"; // Mostra campos de cartão
        } else {
            dadosCartao.style.display = "none"; // Oculta campos de cartão
        }
    });
});

// Função para permitir apenas números
function somenteNumeros(e) {
    const tecla = (window.event) ? event.keyCode : e.which;
    if (tecla > 47 && tecla < 58) return true; // Permite números
    if (tecla === 8 || tecla === 0) return true; // Permite backspace
    return false; // Bloqueia outras teclas
}