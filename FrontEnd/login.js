const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.querySelector("form");
const erreur =document.getElementById("erreur")
const reponseForm={
    "email": "sophie.bluel@test.tld",
    "password": "S0phie",
    };
    const chargeUtile = JSON.stringify(reponseForm);
/**fonction recupere users*/

async function recuperationUtilisateurs(){
    const reponse = await fetch ("http://localhost:5678/api/users/login", {
    method:"POST",
    headers:{"Content-Type": "application/json"},
    body:chargeUtile,
    })
    return await reponse.json();
    
}


/**fonction connexion */
async function login() {
    const utilisateurs = await recuperationUtilisateurs();
    console.log(utilisateurs);
    const token=utilisateurs.token;
    const userId=utilisateurs.id;
    console.log(token);
    window.localStorage.setItem("token",token)
    window.localStorage.setItem("userId",userId)
    form.addEventListener("submit",(e)=>{
        e.preventDefault();
        const emailUti=email.value;
        const mdpUti=password.value;
        console.log(emailUti, mdpUti);
        
            if (reponseForm.email===emailUti && 
                reponseForm.password===mdpUti) {
                    window.sessionStorage.loged= true;
                   window.location.href="./index.html"
            } else {
                email.classList.add("inputErreur");
                password.classList.add("inputErreur");
                erreur.textContent="Veulliez vérifier votre saisie. Votre email ou mot de passe est incorrect."
            }
        });
    
}
login();
