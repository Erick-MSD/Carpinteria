$(document).ready(function() {
  // Código para navegación y animaciones
  $(".navbar a, footer a[href='#myPage']").on('click', function(event) {
      if (this.hash !== "") {
          event.preventDefault();
          var hash = this.hash;
          $('html, body').animate({
              scrollTop: $(hash).offset().top
          }, 900, function() {
              window.location.hash = hash;
          });
      }
  });

  $(window).scroll(function() {
      $(".slideanim").each(function() {
          var pos = $(this).offset().top;
          var winTop = $(window).scrollTop();
          if (pos < winTop + 600) {
              $(this).addClass("slide");
          }
      });
  });

  // Función para obtener y mostrar los productos
  function fetchProducts() {
      fetch('/api/products')
          .then(response => response.json())
          .then(products => {
              let productContainer = $("#product-list");
              productContainer.empty();
              products.forEach(product => {
                  productContainer.append(`
                      <div class="product">
                          <img src="${product.image}" alt="${product.name}">
                          <h3>${product.name}</h3>
                          <p>${product.description}</p>
                          <span>Precio: $${product.price}</span>
                      </div>
                  `);
              });
          })
          .catch(error => console.error('Error al cargar productos:', error));
  }

  // Llamar a la función cuando cargue la página
  fetchProducts();
});
