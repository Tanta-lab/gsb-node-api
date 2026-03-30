Projet GSB — Gestion des rapports de visite

-- Description --

Application permettant à un visiteur médical de :
	•	consulter les médecins
	•	consulter les rapports de visite
	•	créer un rapport
	•	modifier un rapport

-- Technologies --

	•	Node.js (Express)
	•	MySQL (Docker)
	•	JavaScript (front simple)

 -- Installation --
 
1. Cloner le projet :
   git clone https://github.com/Tanta-lab/gsb-node-api.git
   cd gsb-node-api
   
2. Installer les dépendances :
   npm install
   
3. Lancer Docker :
   docker compose up -d
   
4. Lancer le serveur
   npm start

-- Lancer le front --

Ouvrir le fichier :

front/index.html (avec Live Server ou navigateur)

Identifiants de test :
   login: aribiA
   password: aaaa

-- Routes principales --

	•	POST /connexion
	•	GET /medecins
	•	GET /medecins/:id
	•	GET /rapports
	•	POST /rapports
	•	PUT /rapports/:id

-- Fonctionnalités --

	•	Authentification (JWT)
	•	Liste des médecins (pagination + recherche)
	•	Détail d’un médecin
	•	Consultation des rapports
	•	Création d’un rapport
	•	Modification d’un rapport
	•	Filtrage des rapports par date
