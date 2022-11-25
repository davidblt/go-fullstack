// Middlewae qui va authentifier les tokens :
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    try {
        // Extraction du token du header 'Authorization', en 2eme position après 'Bearer' :
        const token = req.headers.authorization.split(' ')[1];

        // Maintenant que l'on a récupéré le token, on le décode :
        const decodedToken = jwt.verify(token, `${process.env.TOKEN}`);

        // Extraction du userId contenu dans le token :
        const userId = decodedToken.userId;

        // Rajout dans les request du userId obtenu :
        req.auth = {
            userId: userId
        }

        // Fonction next() pour passer au middleware suivant
        next();

    } catch (error) {
        res.status(401).json({ error });
    }
}