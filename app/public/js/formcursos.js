// script.js
function atualizarPreview() {
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const preco = document.getElementById("preco").value;
  
    document.getElementById("previewTitulo").textContent = titulo || "Título do Curso";
    document.getElementById("previewDescricao").textContent = descricao || "Descrição do Curso";
    document.getElementById("previewPreco").textContent = preco ? `Preço: R$ ${parseFloat(preco).toFixed(2)}` : "Preço: R$ 0,00";
  }
  
  function mostrarImagem() {
    const file = document.getElementById("imagem").files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("previewImagem").src = e.target.result;
        document.getElementById("previewImagem").style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  }
  
