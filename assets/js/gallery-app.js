angular.module('ksmApp', [])
.controller('MainController', function($scope) {  
$scope.showGallery = false;
$scope.selectedCategory = null;
$scope.currentImageIndex = 0;

    
$scope.categories = [
    // Cocinas
{
    id: 'cocinas',
    name: 'Cocinas',
    thumbnail: './assets/img/cocina.jpg',
    description: 'Nuestras cocinas están diseñadas para combinar funcionalidad y estética, adaptándose a tu estilo y necesidades.',
    images: [
{
    full: './assets/img/cocina.jpg',
    thumb: './assets/img/cocina.jpg',
    title: 'Cocina de estilo Tradicional',
    description: 'Diseño elegante con acabados de alta calidad y funcionalidad integrada.'
        },
{
    full: './assets/img/Cocina5.jpg',
    thumb: './assets/img/Cocina5.jpg',
    title: 'Cocina de estilo Tradicional',
    description: 'Diseño elegante con acabados de alta calidad y funcionalidad integrada.'
        },
{
    full: './assets/img/Cocina4.jpg',
    thumb: './assets/img/Cocina4.jpg',
    title: 'Cocina de estilo Tradicional',
    description: 'Diseño elegante con acabados de alta calidad y funcionalidad integrada.'
        },
{
    full: './assets/img/Cocina3.jpg',
    thumb: './assets/img/Cocina3.jpg',
    title: 'Cocina de estilo Tradicional 2',
    description: 'Otra descripción de la cocina.'
}]
},


// Closets
{
    id: 'closets',
    name: 'Closets',
    thumbnail: './assets/img/closet.jpg',
    description: 'Creamos closets personalizados que aprovechan al máximo el espacio y se adaptan a tus necesidades de almacenamiento.',
    images: [
    {
    full: './assets/img/closet.jpg', 
    thumb: './assets/img/closet.jpg', 
    title: 'Closet Modular',
    description: 'Texto de la descripción de la imagen.'
},
{
    full: './assets/img/Closet2.jpg', 
    thumb: './assets/img/Closet2.jpg', 
    title: 'Closet Modular',
    description: 'Texto de la descripción de la imagen.'
},
{
    full: './assets/img/Closet3.jpg', 
    thumb: './assets/img/Closet3.jpg', 
    title: 'Closet Modular',
    description: 'Texto de la descripción de la imagen.'
},
{
    full: './assets/img/Closet4.jpg', 
    thumb: './assets/img/Closet4.jpg', 
    title: 'Closet Modular',
    description: 'Texto de la descripción de la imagen.'
},
{
    full: './assets/img/Closet5.jpg', 
    thumb: './assets/img/Closet5.jpg', 
    title: 'Closet Modular',
    description: 'Texto de la descripción de la imagen.'
},


]
},
// Vestidores
{
    id: 'vestidores',
    name: 'Vestidores',
    thumbnail: './assets/img/vestidor.jpg',
    description: 'Diseñamos vestidores elegantes y funcionales que transformarán tu experiencia diaria.',
    images: [
{
    full: './assets/img/vestidor.jpg',
    thumb: './assets/img/vestidor.jpg', 
    title: 'Título de la imagen',
    description: 'Texto de la descripción de la imagen.'
    },
{
    full: './assets/img/vestidor1.1.jpg',
    thumb: './assets/img/vestidor1.1.jpg', 
    title: 'Título de la imagen',
    description: 'Texto de la descripción de la imagen.'
},
{
    full: './assets/img/vestidor1.2.jpg',
    thumb: './assets/img/vestidor1.2.jpg', 
    title: 'Título de la imagen',
    description: 'Texto de la descripción de la imagen.'
    },
]
},
// Baños
{
    id: 'muebles-bano',
    name: 'Muebles de baño',
    thumbnail: './assets/img/baño.jpg',
    description: 'Nuestros muebles de baño combinan durabilidad, resistencia a la humedad y diseño contemporáneo.',
    images: [
{
    full: './assets/img/baño.jpg',
    thumb: './assets/img/baño.jpg',
    title: 'Título de la imagen',
    description: 'Texto de la descripción de la imagen.'
    },
{
    full: './assets/img/Baño1.jpg',
    thumb: './assets/img/Baño1.jpg', 
    title: 'Título de la imagen',
    description: 'Texto de la descripción de la imagen.'
    },    
]
},
// Muebles especiales
{
    id: 'muebles-especiales',
    name: 'Muebles especiales',
    thumbnail: './assets/img/mueble esp.jpg',
    description: 'Creamos muebles a medida para necesidades específicas, desde centros de entretenimiento hasta escritorios personalizados.',
    images: [
{
    full: './assets/img/mueble esp.jpg',
    thumb: './assets/img/mueble esp.jpg', 
    title: 'Título de la imagen',
    description: 'Texto de la descripción de la imagen.'
    },
{
    full: './assets/img/MuebleEspecial4.jpg',
    thumb: './assets/img/MuebleEspecial4.jpg', 
    title: 'Título de la imagen',
    description: 'Texto de la descripción de la imagen.'
    },
{
    full: './assets/img/MuebleEspecial2.jpg',
    thumb: './assets/img/MuebleEspecial2.jpg', 
    title: 'Título de la imagen',
    description: 'Texto de la descripción de la imagen.'
    },
{
    full: './assets/img/MuebleEspecial3.jpg',
    thumb: './assets/img/MuebleEspecial3.jpg', 
    title: 'Título de la imagen',
    description: 'Texto de la descripción de la imagen.'
    },   
]}
];

// Método para mostrar la galería de una categoría
    $scope.showCategoryGallery = function(category) {
        $scope.selectedCategory = category;
        $scope.showGallery = true;
        $scope.currentImageIndex = 0; 

        // Mostrar solo la primera imagen
        setTimeout(function() {
            updateVisibleImage($scope.currentImageIndex);
        }, 100);
    };

    // Método para cambiar a la siguiente imagen
    $scope.nextImage = function() {
        if ($scope.selectedCategory && $scope.selectedCategory.images.length > 0) {
            $scope.currentImageIndex = ($scope.currentImageIndex + 1) % $scope.selectedCategory.images.length;
            updateVisibleImage($scope.currentImageIndex);
        }
    };

    // Método para cambiar a una imagen específica
    $scope.showImage = function(index) {
        if ($scope.selectedCategory && index >= 0 && index < $scope.selectedCategory.images.length) {
            $scope.currentImageIndex = index;
            updateVisibleImage($scope.currentImageIndex);
        }
    };

    // Función auxiliar para actualizar la imagen visible
    function updateVisibleImage(index) {

        var tabs = document.querySelectorAll('#gallery-container-' + $scope.selectedCategory.id + ' .tab');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].style.display = 'none';
            tabs[i].classList.remove('active-tab');
        }

        if (tabs[index]) {
            tabs[index].style.display = 'block';
            tabs[index].classList.add('active-tab');
        }

       //Funcion que activa la miniatura

        var navLinks = document.querySelectorAll('#gallery-container-' + $scope.selectedCategory.id + '-nav a');
        for (var j = 0; j < navLinks.length; j++) {
            navLinks[j].classList.remove('active');
        }
        if (navLinks[index]) {
            navLinks[index].classList.add('active');
        }
    }

    $scope.backToCategories = function() {
        $scope.showGallery = false;
        $scope.selectedCategory = null;
        $scope.currentImageIndex = 0;
    };
});

// Iniciar Angular

angular.element(document).ready(function() {
    if (!angular.element(document.body).scope()) {
        angular.bootstrap(document, ['ksmApp']);
    }
});