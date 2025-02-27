angular.module('ksmApp', [])
.controller('MainController', function($scope) {  
$scope.showGallery = false;
$scope.selectedCategory = null;

// Esta es la seccion de la galeria y sus imagenes, 

//Cocinas
$scope.categories = [

//imagen principal que se muestra en la pagina principal
{
    id: 'cocinas',
    name: 'Cocinas',
    thumbnail: './assets/img/cocina.jpg',
    description: 'Nuestras cocinas están diseñadas para combinar funcionalidad y estética, adaptándose a tu estilo y necesidades.',
    images: [

//este es el formato para ir agregando las imagenes que queramos, solo copien y peguenlo.. (solo coloquen la imagen dos veces en la miniatura)
{
    full: './assets/img/vestidor.jpg',
    thumb: './assets/img/vestidor.jpg',
    title: 'Cocina de estilo Tradicional ',
    description: 'Diseño elegante con acabados de alta calidad y funcionalidad integrada etcetc.'
    },
{
    full: '.assets/img/uso2.jpg',
    thumb: './assets/img/cocina.jpg',
    title: 'Cocina de estilo Tradicional 2maxplus300 ',
    description: 'otra descripcion de la cocina c.'
    },
]
//Closets
},
    {
    id: 'closets',
    name: 'Closets',
    thumbnail: './assets/img/closet.jpg',
    description: 'Creamos closets personalizados que aprovechan al máximo el espacio y se adaptan a tus necesidades de almacenamiento.',
    images: [
{
    full: 'Carpinteria\assets\img\vestidor.jpg',
    thumb: '',
    title: 'Closet Modular',
    description: 'Texto de la descripcion de la imagen.'
    },
]
//vestidores
},
    {
    id: 'vestidores',
    name: 'Vestidores',
    thumbnail: './assets/img/baño.jpg',
    description: 'Diseñamos vestidores elegantes y funcionales que transformarán tu experiencia diaria.',
    images: [
{
    full: './assets/img/gallery/vestidores/vestidor1.jpg',
    thumb: '',
    title: 'Titulo de la imagen',
    description: 'Texto de la descripcion de la imagen.'
    },
]
//Baños
},
    {
    id: 'muebles-bano',
    name: 'Muebles de baño',
    thumbnail: './assets/img/baño.jpg',
    description: 'Nuestros muebles de baño combinan durabilidad, resistencia a la humedad y diseño contemporáneo.',
    images: [
{
    full: './assets/img/gallery/banos/bano1.jpg',
    thumb: './assets/img/gallery/banos/thumbs/bano1.jpg',
    title: 'Titulo de la imagen',
    description: 'Texto de la descripcion de la imagen.'
    },
]
//Muebles especiales
},
{
    id: 'muebles-especiales',
    name: 'Muebles especiales',
    thumbnail: './assets/img/mueble esp.jpg',
    description: 'Creamos muebles a medida para necesidades específicas, desde centros de entretenimiento hasta escritorios personalizados.',
    images: [
{
    full: './assets/img/gallery/especiales/especial1.jpg',
    thumb: '',
    title: 'Titulo de la imagen',
    description: 'Texto de la descripcion de la imagen.'
    },

]
    }
];


// Este apartado lo hizo GPT para implementar lenguaje de YETTI al trabajo, ya que no sabia que hacia muy bien. 

$scope.showCategoryGallery = function(category) {
    $scope.selectedCategory = category;
    $scope.showGallery = true;
    setTimeout(function() {
window.galleryTabber = new Yetii({
        id: 'gallery-container-' + category.id
});

// Mostrar la primera imagen

document.querySelector('#gallery-container-' + category.id + ' .tab').style.display = 'block';
    }, 100);
};

// Esta funcion sirve para poder salir y entrar de la galeria 

$scope.backToCategories = function() {
    $scope.showGallery = false;
    $scope.selectedCategory = null;
};
});

// Para que inicie Angular

angular.element(document).ready(function() {
if (!angular.element(document.body).scope()) {
    angular.bootstrap(document, ['ksmApp']);
}
});