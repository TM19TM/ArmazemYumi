const API_URL = "http://localhost:3000/produtos";

const modal = document.getElementById("modalOverlay");
const stockModal = document.getElementById("stockModalOverlay");

document.getElementById("openModal").onclick = () => modal.style.display = "block";
document.getElementById("openStockModal").onclick = () => abrirReposicao();

/**
 * Converte links do Google Drive para o formato direto de visualização.
 * Suporta links de compartilhamento padrão e links diretos do servidor de conteúdo (lh3).
 */
function formatarLinkDrive(link) {
    if (link.includes('drive.google.com')) {
        const match = link.match(/\/d\/(.+?)\/(view|edit)?/);
        if (match && match[1]) {
            return `https://lh3.googleusercontent.com/u/0/d/${match[1]}`;
        }
    }
    return link; 
}

function ajustarCampos() {
    const cat = document.getElementById("categoriaSelect").value;
    const area = document.getElementById("areaDinâmica");
    area.innerHTML = (["Adesivo", "Boneco", "Chaveiro", "Caneta", "Colar", "PhoneStrap"].includes(cat)) 
        ? `<select id="classe" required><option value="Bronze">Bronze</option><option value="Prata">Prata</option><option value="Ouro">Ouro</option></select>`
         `<select id="tamanho" required><option value="Pequeno">Pequeno</option><option value="Médio">Médio</option><option value="Grande">Grande</option></select>`
        : `<select id="combo" required><option value="Individual">Individual</option><option value="Combo">Combo</option></select>`;
}

async function abrirReposicao() {
    stockModal.style.display = "block";
    const res = await fetch(API_URL);
    const produtos = await res.json();
    document.getElementById("listaReposição").innerHTML = produtos.map(p => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee">
            <span>${p.nome}</span>
            <button onclick="adicionarUm('${p._id}')" style="cursor:pointer; background:#C8B2F2; border:1px solid #000; border-radius:5px; padding:2px 10px">+</button>
        </div>
    `).join('');
}

async function adicionarUm(id) {
    await fetch(`${API_URL}/${id}/adicionar-um`, { method: 'PATCH' });
    renderizar();
    abrirReposicao();
}

async function removerUm(id) {
    await fetch(`${API_URL}/${id}/remover-um`, { method: 'PATCH' });
    renderizar();
}

document.getElementById("formProduto").onsubmit = async (e) => {
    e.preventDefault();
    const data = {
        nome: document.getElementById("nome").value,
        categoria: document.getElementById("categoriaSelect").value,
        classe: document.getElementById("classe")?.value || null,
        tamanho: document.getElementById("tamanho")?.value || null,
        combo: document.getElementById("combo")?.value || null,
        quantidade: document.getElementById("quantidade").value,
        valor: document.getElementById("valor").value,
        imagem: formatarLinkDrive(document.getElementById("imagem").value)
    };
    await fetch(API_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
    modal.style.display = "none";
    renderizar();
};

async function renderizar() {
    const container = document.getElementById("catalogoCompleto");
    const res = await fetch(API_URL);
    const produtos = await res.json();
    const categorias = ["Adesivo", "Boneco", "Brinco", "Caneta", "Chaveiro", "Colar", "Fotocard", "PhoneStrap", "Pulseira"];
    
    container.innerHTML = categorias.map(cat => {
        const itens = produtos.filter(p => p.categoria === cat);
        if (itens.length === 0) return '';
        return `
            <section id="sec-${cat}" class="categoria-group">
                <h2>${cat}s</h2>
                <div class="grid-container">
                    ${itens.map(p => `
                        <div class="card-produto">
                            <img src="${formatarLinkDrive(p.imagem)}" onerror="this.src='https://via.placeholder.com/110x140?text=Erro+Imagem'">
                            <div class="info">
                                <h4>${p.nome}</h4>
                                <p class="price">R$ ${parseFloat(p.valor).toFixed(2)}</p>
                                <p>Qnt - ${p.quantidade}</p>
                                <small>${p.classe || p.tamanho || p.combo || ''}</small>
                                <button class="btn-remover-card" onclick="removerUm('${p._id}')">Remover 1</button>
                            </div>
                        </div>`).join('')}
                </div>
            </section>`;
    }).join('');
}
window.onload = renderizar;