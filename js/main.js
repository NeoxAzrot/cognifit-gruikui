// Fonction pour PWA
window.onload = () => {
	'use strict';

	// test si le navigateur du client gère le serviceWorker
	if ('serviceWorker' in navigator) {
	navigator.serviceWorker
			 .register('./sw.js'); // le cas échant on enregistre notre gestionnaire
	}
}

// Code du jeu
/***************************************************************************
*
*	@name: CogniFit - Gruikui
*	@description: Entraine ta mémoire et ta réactivité avec ce jeu cognitif. Le but sera de mémoriser l’ordre d’affichage et de le reproduire.
*	@author: Sami Lafrance - contact@samilafrance.com
*	@website: https://www.samilafrance.com
*	@version: 1.0.0
*
*	@copyright Copyright ©2020 - All rights reserved
*
***************************************************************************/

// Déclaration des variables global
const arrayGruikui = $('.gruikui')
const images = [
	'images/gruikui-blue.png',
	'images/gruikui-brown.png',
	'images/gruikui-green.png',
	'images/gruikui-night.png',
	'images/gruikui-orange.png',
	'images/gruikui-red.png'
]
let actualImage = 'images/gruikui-orange.png' // Initialise le Gruikui orange
let pingImage; // Initialise une image pour le ping
let level = 1 // Initialise le niveau 1
let path = []

// Fonction pour avoir un nombre aléatoire dans une intervalle fermée
const getRandom = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min +1)) + min
}

// Fonction pour commencer le jeu
const start = async () => {
	$(".start-menu").fadeOut()
	setTimeout(function(){ $(".play-screen").fadeIn() }, 500)
	await pause(1000)
	randomPath()
}

// Fonction pour choisir le modèle
const randomPath = () => {
	arrayGruikui.removeClass('hover') // Enlève l'animation du hover pendant l'affichage du modèle
	for (let i = 0; i < level; i++) {
		path.push(getRandom(0, arrayGruikui.length-1))
	}
	showPath()
}

// Fonction pour montrer le modèle
const showPath = async () => { // async pour utiliser la fonction pause
	for (let i = 0; i < path.length; i++) {
		await pause(800)
		arrayGruikui[path[i]].src = pingImage // Montre le modèle en changeant l'image
		await pause(800)
		arrayGruikui[path[i]].src = actualImage // Remet l'image de base
	}
	userTurn()
}

// Fonction pour dire à l'utilisateur de jouer et réactiver le hover
const userTurn = () => {
	$("#showPath").fadeOut()
	setTimeout(function(){ $("#userTurn").fadeIn() }, 400)
	arrayGruikui.addClass('hover') // Ajoute l'animation du hover pendant l'affichage du modèle
}

// Fonction pour choisir une image aléatoire pour montrer le chemin
const randomImage = () => {
	let image = images[getRandom(0, images.length-1)]
	while(image == actualImage) {
		image = images[getRandom(0, images.length-1)]
	}
	return image
}
pingImage = randomImage() // Initialise une image pour ping

// Fonction pour cliquer sur les images
arrayGruikui.click(async function() {
	this.src = pingImage
	await pause(400)
	this.src = actualImage
	checkClick(this)
})

// Fonction pour vérifier si on clique sur la bonne image
const checkClick = (x) => {
	const index = arrayGruikui.index(x)
	if(index == path[0]) {
		path.shift() // Supprime le premier élément du tableau
		checkPath()
	} else {
		losingScreen()
	}
}

// Fonction pour vérifier si on a finit la séquence
const checkPath = () => {
	if(path.length == 0) {
		winningScreen()
	}
}

// Fonction pour afficher l'écran si l'utilisateur perd
const losingScreen = () => {
	$(".play-screen").fadeOut()
	setTimeout(function(){ $(".losing-screen").fadeIn() }, 500)
}

// Fonction pour afficher l'écran si l'utilisateur gagne
const winningScreen = () => {
	$(".play-screen").fadeOut()
	setTimeout(function(){ $(".winning-screen").fadeIn() }, 500)
}

// Fonction pour aller au niveau suivant
const nextLevel = async () => {
	level++;
	$('#level-number').text(`${level < 10 ? '0' : ''}${level}`) // Change le texte du level
	changeImage()
	$(".winning-screen").fadeOut()
	setTimeout(function(){ $(".play-screen").fadeIn() }, 500)
	await pause(1000)
	randomPath()
}

// Fonction pour recommencer le jeu
const restart = async () => {
	$(".losing-screen").fadeOut()
	setTimeout(function(){ $(".play-screen").fadeIn() }, 500)
	await pause(1000)
	showPath() // Permet de reprendre où on avait perdu
}

// Fonction pour changer la couleur des images pour le prochain niveau
const changeImage = () => {
	for (var i = 0; i < arrayGruikui.length; i++) {
		arrayGruikui[i].src = pingImage
	}
	actualImage = pingImage
	pingImage = randomImage()
}

// Fonction pour faire une pause
const pause = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
