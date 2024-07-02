const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.querySelector("form");
const erreur =document.getElementById("erreur") 


/**
 * Récupération des données du formulaire 
 */
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const emailUti=email.value;
    const mdpUti=password.value;
    const reponseForm={
        "email": emailUti,
        "password": mdpUti,
        };
        console.log(reponseForm);
    const chargeUtile = JSON.stringify(reponseForm);
    console.log(chargeUtile);
    login(chargeUtile);
})
/**
 * Fonction qui envoie une requête avec les données 
 */
async function recuperationUtilisateurs(chargeUtile){
        const reponse = await fetch ("http://localhost:5678/api/users/login", {
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:chargeUtile,
        })
        return await reponse.json();
}
/**
 * Fonction login 
 */   
async function login(chargeUtile){
        const utilisateurs = await recuperationUtilisateurs(chargeUtile);
        console.log(utilisateurs);
        const token=utilisateurs.token;
        const userId=utilisateurs.id;
        console.log(token);
        window.localStorage.setItem("token",token);
        window.localStorage.setItem("userId",userId);
        if (!token== "" ) {
            window.sessionStorage.loged= true;
           window.location.href="./index.html"
        } else {
            email.classList.add("inputErreur");
            password.classList.add("inputErreur");
            erreur.textContent="Veulliez vérifier votre saisie. Votre email ou mot de passe est incorrect."
        }
    }







