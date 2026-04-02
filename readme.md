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

-- Diagramme des cas d'utilisation --


<img width="547" height="373" alt="Capture d’écran 2026-04-02 à 09 12 00" src="https://github.com/user-attachments/assets/4db8dde5-e1e2-4409-95cb-2ca1674b0acb" />



-- MCD --

<img width="887" height="384" alt="Capture d’écran 2026-04-02 à 09 34 49" src="https://github.com/user-attachments/assets/31bf2810-eeff-4658-bc20-8b87556d9fad" />


