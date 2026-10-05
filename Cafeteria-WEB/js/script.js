// ==================== MENU HAMBURGER ====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ==================== FILTROS DE PRODUTOS ====================
const filtros = document.querySelectorAll('.filtro-btn');
const produtos = document.querySelectorAll('.produto-card');

if (filtros.length > 0) {
    filtros.forEach(filtro => {
        filtro.addEventListener('click', () => {
            const categoria = filtro.getAttribute('data-filtro');

            // Atualizar botão ativo
            filtros.forEach(btn => btn.classList.remove('active'));
            filtro.classList.add('active');

            // Mostrar/Esconder produtos
            produtos.forEach(produto => {
                if (categoria === 'todos' || produto.getAttribute('data-categoria') === categoria) {
                    produto.style.display = 'block';
                } else {
                    produto.style.display = 'none';
                }
            });
        });
    });
}

// ==================== FORMULÁRIO DE PEDIDOS ====================
const formPedido = document.getElementById('formPedido');
const tipoEntregaRadios = document.querySelectorAll('input[name="entrega"]');
const enderecoFieldset = document.getElementById('endereco-fieldset');

if (tipoEntregaRadios) {
    tipoEntregaRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const ehDelivery = document.querySelector('input[name="entrega"]:checked').value === 'delivery';
            if (enderecoFieldset) {
                enderecoFieldset.style.display = ehDelivery ? 'block' : 'none';
            }
            atualizarResumo();
        });
    });
}

// ==================== SELEÇÃO DE PRODUTOS ====================
const checkboxesProdutos = document.querySelectorAll('.produto-pedido input[type="checkbox"]');
const inputsQuantidade = document.querySelectorAll('.produto-pedido .quantidade');

if (checkboxesProdutos.length > 0) {
    checkboxesProdutos.forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
            // Habilitar/Desabilitar input de quantidade
            inputsQuantidade[index].disabled = !checkbox.checked;
            if (!checkbox.checked) {
                inputsQuantidade[index].value = '0';
            } else {
                inputsQuantidade[index].value = '1';
            }
            atualizarResumo();
        });
    });

    inputsQuantidade.forEach(() => {
        addEventListener('change', atualizarResumo);
    });
}

// ==================== ATUALIZAR RESUMO DO PEDIDO ====================
function atualizarResumo() {
    const resumoItens = document.getElementById('resumo-itens');
    const subtotal = document.getElementById('subtotal');
    const total = document.getElementById('total');
    const entregaLinha = document.getElementById('entrega-linha');
    const taxaEntrega = document.getElementById('taxa-entrega');

    if (!resumoItens) return;

    let itens = [];
    let somaSubtotal = 0;

    checkboxesProdutos.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const quantidade = parseInt(inputsQuantidade[index].value) || 0;
            if (quantidade > 0) {
                const nome = checkbox.value.replace('-', ' ').toUpperCase();
                const preco = parseFloat(checkbox.getAttribute('data-preco'));
                const precoItem = preco * quantidade;

                itens.push({
                    nome: nome,
                    quantidade: quantidade,
                    preco: preco.toFixed(2),
                    total: precoItem.toFixed(2)
                });

                somaSubtotal += precoItem;
            }
        }
    });

    // Atualizar resumo
    if (itens.length === 0) {
        resumoItens.innerHTML = '<p class="vazio">Nenhum produto selecionado</p>';
    } else {
        resumoItens.innerHTML = itens.map(item => `
            <div class="resumo-item">
                <span class="resumo-item-nome">${item.quantidade}x ${item.nome}</span>
                <span class="resumo-item-preco">R$ ${item.total}</span>
            </div>
        `).join('');
    }

    // Calcular total com entrega
    let totalFinal = somaSubtotal;
    const tipoEntrega = document.querySelector('input[name="entrega"]:checked');

    if (tipoEntrega && tipoEntrega.value === 'delivery') {
        totalFinal += 5.00;
        if (entregaLinha) entregaLinha.style.display = 'flex';
    } else {
        if (entregaLinha) entregaLinha.style.display = 'none';
    }

    // Atualizar valores
    if (subtotal) subtotal.textContent = `R$ ${somaSubtotal.toFixed(2).replace('.', ',')}`;
    if (total) total.textContent = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
}

// ==================== ENVIAR FORMULÁRIO ====================
if (formPedido) {
    formPedido.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar se tem produtos
        if (!document.querySelector('.produto-pedido input[type="checkbox"]:checked')) {
            alert('Selecione pelo menos um produto!');
            return;
        }

        // Coletar dados do pedido
        const pedidoDados = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            entrega: document.querySelector('input[name="entrega"]:checked').value,
            pagamento: document.querySelector('input[name="pagamento"]:checked').value,
            observacoes: document.getElementById('observacoes').value,
            produtos: [],
            total: document.getElementById('total').textContent
        };

        // Adicionar endereço se for delivery
        if (pedidoDados.entrega === 'delivery') {
            pedidoDados.endereco = {
                rua: document.getElementById('rua').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value
            };
        }

        // Coletar produtos
        checkboxesProdutos.forEach((checkbox, index) => {
            if (checkbox.checked) {
                const quantidade = parseInt(inputsQuantidade[index].value);
                if (quantidade > 0) {
                    pedidoDados.produtos.push({
                        nome: checkbox.value,
                        quantidade: quantidade,
                        preco: checkbox.getAttribute('data-preco')
                    });
                }
            }
        });

        // Simular envio (em produção, seria uma requisição AJAX)
        console.log('Pedido enviado:', pedidoDados);
        alert('Pedido enviado com sucesso! Em breve você receberá uma confirmação por WhatsApp.');
        formPedido.reset();
        atualizarResumo();
    });
}

// Inicializar resumo ao carregar
document.addEventListener('DOMContentLoaded', () => {
    atualizarResumo();
});