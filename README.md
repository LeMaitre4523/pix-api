
# Pix API

Un simple module capable d'interagir avec le service français [Pix](https://pix.fr/).


## Features

- Se connecter avec des identifiants/tokens
- Obtenir son profil
- Obtenir ses compétences
- Obtenir ses certifications
- Révoquer les tokens

## Installation
```bash
  npm i pix-api-client
```

## Exemples

```javascript
const PIX = require("pix-api-client");
const pix = new PIX();

//Connexion avec des identifiants
await pix.loginWithCredentials("username", "password");

//Connexion avec des tokens
await pix.loginWithTokens("userId", "access_token", "refresh_token");


//Vous avez le choix entre révoquer seulement un token (access_token ou refresh_token) ou alors les deux
await pix.revokeTokens({
	access_token: "test", //refresh_token: "test"
});

await pix.revokeTokens();

//Obtenir les informations de l'utilisateur
pix.getUser();

//Obtenir ses certifications
pix.getCertifications().then(certifications => {
    
})

//Obtenir les compétences de l'utilisateur
pix.getCompetences().then(profile => {
    /*
    {
    	global: {
        	pix_score: 896,
        	max_reachable_level: 7,
        	max_reachable_pix_score: 896
        },
		competences: [{
			id: 'racvoGdr7z2z8pXWb',
			title: 'Information et données',
			code: '1',
			color: 'jaffa',
			scorecards: [
				{
					type: 'scorecards',
					id: 'userId_racsvLz2W2ShyufE65',
					attributes: [Object],
					relationships: [Object]
				},
				//...
			]},
			//...
		}
	}
    */
})

```


## License

[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)


## Auteur

- [@LeMaitre4523](https://www.github.com/LeMaitre4523)

