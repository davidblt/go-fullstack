// Multer est un package qui permet de gérer les fichiers entrants dans les requêtes HTTP comme les images par exemple.
const multer = require('multer');

// On peut récupérer le type d'extension grâce aux MIME_TYPES du fichier envoyé par le frontend (image/jpg par ex) qu'on change en jpg ou png.
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/*
diskStorage()  configure le chemin et le nom de fichier pour les fichiers entrants.
On passe la destination (dossier images) et le fichier avec son type d'extension (jpg, png,...) et une date (Date.now())pour le rendre le plus unique possible.
*/
const storage = multer.diskStorage({
	// La fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
	destination: (req, file, callback) => {
		callback(null, 'images');
	},

	filename: (req, file, callback) => {
		const name = file.originalname.split(' ').join('_');
		// Le nom de fichier peut contenir des espaces. On les supprime avec split() et on les remplace par des '_' avec join().
		const extension = MIME_TYPES[file.mimetypes];
		// On a donc le nom + date puis . extension :
		callback(null, name + Date.now() + '.' + extension);
	},
});

// Enfin, on exporte ce middleware. On lui passe l'objet 'storage' qu'on a configuré et on lui indique par 'single()' qu'il s'agit d'un fichier unique et non d'un groupe de fichiers et qu'il s'agit d'image.
module.exports = multer({ storage: storage }).single('image');