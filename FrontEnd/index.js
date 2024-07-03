/**
 * Variables
 * */
const token = localStorage.getItem("token");
console.log("token", token);
const gallery = document.getElementById("galerie");
const filtres = document.getElementById("filtres");

/** 
 *Fonction qui retourne le tableau des travaux provenant du back-end
 */
async function recupererTravaux() {
  const donnees = await fetch("http://localhost:5678/api/works");
  return await donnees.json();
}

/**
 * Fonction-Affiche travaux dans la galerie
 */
function creationProjet(projet) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = projet.imageUrl;
  figcaption.textContent = projet.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

async function affichageGalerie() {
  gallery.innerHTML = "";
  const tableauTravaux = await recupererTravaux();
  tableauTravaux.forEach((projet) => {
    creationProjet(projet);
  });
}
affichageGalerie();



/**
 *Tableau catégorie
 */
async function recupererCategorie() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  return await reponse.json();
}

/**
 *Afficher les boutons
 */
async function afficherBoutons() {
  const categories = await recupererCategorie();
  console.log(categories);
  const btnTous = document.createElement("button");
  btnTous.textContent = "Tous";
  btnTous.id = "0";
  btnTous.classList.add("filtres");
  filtres.appendChild(btnTous);
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    btn.classList.add("filtres");
    filtres.appendChild(btn);
  });
}
afficherBoutons();

/**
 * Filtre 
 */
async function filtrerCategories() {
  const projets = await recupererTravaux();
  const boutons = document.querySelectorAll("#filtres button");
  console.log(boutons);
  boutons.forEach((bouton) => {
    bouton.addEventListener("click", (e) => {
      const boutonId = e.target.id;
      gallery.innerHTML = "";
      if (boutonId !== "0") {
        const projetFiltre = projets.filter((projet) => {
          return projet.categoryId == boutonId;
        });
        projetFiltre.forEach((projet) => {
          creationProjet(projet);
        });
      } else {
        affichageGalerie();
      }
    });
  });
}
filtrerCategories();


/**
 * Si utilisateur connecté 
 */
const connecte = window.sessionStorage.loged;
const loginOut = document.getElementById("loginOut");
const modif = document.getElementById("modif");
const edit = document.getElementById("edition");
const modale = document.querySelector(".modale");
const croix = document.getElementById("croix");
const boiteModale = document.getElementById("modaleBoite");
const btnPhoto = document.getElementById("btnPhoto");
const modaleGalerie = document.getElementById("modaleGalerie");

if (connecte) {
  edit.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Mode édition`;
  edit.classList.add("edit");
  loginOut.textContent = "Logout";
  modif.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> modifier`;
  filtres.remove();
  loginOut.addEventListener("click", () => {
    window.sessionStorage.loged = false;
  });
}

/** Affichage Modale */

modif.addEventListener("click", () => {
  modale.style.display = "flex";
});
edit.addEventListener("click", () => {
  modale.style.display = "flex";
});
croix.addEventListener("click", () => {
  modale.style.display = "none";
});
modale.addEventListener("click", (e) => {
  if (e.target.className == "modale") {
    modale.style.display = "none";
  }
});
/**
 * Création figure pour projet avec corbeille
 */
function travauxModale(projet) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const poubelleIcone = document.createElement("span");
  poubelleIcone.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  poubelleIcone.classList.add("poubelle");
  poubelleIcone.id = projet.id;
  img.src = projet.imageUrl;
  figure.appendChild(poubelleIcone);
  figure.appendChild(img);
  modaleGalerie.appendChild(figure);
}

/**
 * Affichage travaux dans la modale
 */
async function affichageGalerieModale() {
  const modaleGalerie = document.getElementById("modaleGalerie");
  modaleGalerie.innerHTML = "";
  const tableauTravaux = await recupererTravaux();
  tableauTravaux.forEach((projet) => {
    travauxModale(projet);
  });
  supprimerProjet();
}
affichageGalerieModale();



/** 
 * Suppression travaux 
 */
function supprimerProjet() {
  const poubelles = document.querySelectorAll(".poubelle");
  const token = localStorage.getItem("token");
  poubelles.forEach((poubelle) => {
    poubelle.addEventListener("click", (e) => {
      e.preventDefault();
      const id = poubelle.id;
      const init = {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      fetch("http://localhost:5678/api/works/" + id, init)
        .then((response) => {
          if (!response.ok) {
            console.log("le delete n'a pas marcher");
          }
          return response;
        })
        .then((data) => {
          console.log("le delete a reusi voila data:", data);
          affichageGalerie();
          affichageGalerieModale();
        });
    });
  });
}


/**
 * Affichage modale ajout travaux 
 */
const modaleBoiteAjout = document.getElementById("modaleBoiteAjout");
const fleche = document.getElementById("fleche");
const croixAjout = document.getElementById("croixAjout");


/** 
 * Fermeture/Affichage modale Ajout
 */
btnPhoto.addEventListener("click", () => {
  modaleBoiteAjout.style.display = "flex";
  modaleBoite.style.display = "none";
});
fleche.addEventListener("click", () => {
  modaleBoiteAjout.style.display = "none";
  modaleBoite.style.display = "flex";
});
croixAjout.addEventListener("click", () => {
  modale.style.display = "none";
  modaleBoiteAjout.style.display = "none";
  modaleBoite.style.display = "flex";
});

/**
 * Prévisualisation photo 
 */
const inputPhoto = document.getElementById("photo");
const visuPhoto = document.querySelector(".visuPhoto");
const labelVisuPhoto = document.getElementById("labelVisu");
const formulaire = document.getElementById("modaleFormAjout");

inputPhoto.addEventListener("change", () => {
  const fichier = inputPhoto.files[0];
  console.log(fichier);

  if (inputPhoto.files.length > 0) {
    const fileSize = inputPhoto.files.item(0).size;
    const fileMo = fileSize / 1024 ** 2;
    if (fileMo >= 4) {
      labelVisuPhoto.classList.add("erreurTaille");
      formulaire.reset();
    } else {
      const reader = new FileReader();
      reader.onload = function (e) {
      visuPhoto.src = e.target.result;
      visuPhoto.style.display = "flex";
      labelVisuPhoto.style.display = "none";
      labelVisuPhoto.classList.remove("erreurTaille");
      
    };
    reader.readAsDataURL(fichier);
    }
  }

  
});


/**
 * Affichage catégorie dans select
 */

async function afficherSelection() {
  const select = document.getElementById("categoriePhoto");
  const categories = await recupererCategorie();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.textContent = category.name;
    option.value = category.id;
    categoriePhoto.appendChild(option);
  });
}
afficherSelection();

/**
 * Ajout photo
 */

const notif = document.getElementById("notif");

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titreForm = document.getElementById("titrePhoto");
  const nouveauTitre = titreForm.value;
  console.log(nouveauTitre);

  const nouvelleCategorie = document.getElementById("categoriePhoto");
  const options = document.querySelector("select").value;
  console.log(options);

  const fichierPhoto = document.getElementById("photo");
  console.log(fichierPhoto);
  const fichier = fichierPhoto.files[0];
  console.log(fichier);

  const userId = localStorage.getItem("userId");

  const formData = new FormData();
  formData.append("title", nouveauTitre);
  formData.append("category", options);
  formData.append("image", fichier);
  formData.append("userId", userId);
  console.log(formData);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      notif.textContent = "Votre photo a été ajoutée dans votre galerie.";
      notif.classList.add("ajout");
      affichageGalerie();
      affichageGalerieModale();
      formulaire.reset();
      visuPhoto.style.display = "none";
      labelVisuPhoto.style.display = "flex";
    })
    .catch((error) => {
      console.log("l'erreur est", error);
    });
});

/**
 * Fonction pour vérifier que le formulaire est correctement rempli
 */
async function formComplet() {
  await formulaire.addEventListener("change", () => {
    const btnValidation = document.getElementById("btnAjout");
    const photo = inputPhoto.files[0];
    console.log(photo);
    const titre = document.getElementById("titrePhoto");
    console.log(titre.value);
    const categorie = document.getElementById("categoriePhoto");
    console.log(categorie.value);
    if (!photo == "" && !titre.value == "" && !categorie.value == "") {
      btnValidation.classList.add("valide");
      btnValidation.classList.remove("button");
      btnValidation.classList.remove("nonValide");
      console.log("ca fonctionne ");
      notif.textContent = "Vous pouvez valider le formulaire.";
      notif.classList.add("ajout");
      notif.classList.remove("echec");
    } else {
      btnValidation.classList.add("nonValide");
      btnValidation.classList.remove("button");
      console.log("le form pas correctement renseigne");
      notif.textContent = "Veuillez remplir tous les champs du formulaire.";
      notif.classList.add("echec");
    }
  });
}
formComplet();
