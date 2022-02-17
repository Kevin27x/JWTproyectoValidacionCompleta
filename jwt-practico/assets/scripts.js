//1. id y for del formulario cambiados.
//2.Capturar evento submit y los datos del formulario (en este caso jquery)
//3. capturar inputs

$("#jwt-formulario").submit(async(event) => {
    
    event.preventDefault();
    const email = document.getElementById("jwt-email").value;
    const password = document.getElementById("jwt-password").value;
    //guardar el token en JWT. Necesita un AWAIT Y UN ASYNC (a la función padres)
    const JWT = await postData(email, password);
    //dispara la petición con el token en el header. Retorna la data de petición
    const resultado = await getPosts(JWT);
    //dispara la función que rellena la tabla con los datos obtenidos de la petición
    llenadoTabla(resultado)
    toggleFormTabla("jwt-div-form","jwt-tabla" )

});
//4. Crear llamado a Endpoint

const postData = async(emailIng, passwordIng) => {
    try {
        //Enviamos los datos EMAIL Y USUARIO mediante método POST y en el Body del msj. Debe estar en formato json.
        //JSON.stringify transforma el objeto javascript a objeto json
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            //cuerpo
            body: JSON.stringify({email: emailIng, password: passwordIng})
        });
        //Responde con promesa. Por eso, tenemos que anteponer AWAIT
        //desestructuramos el objeto para rescatar solo su valor. O también podemos acceder al objeto "token" y acceder a su atributo "token"
        const {token} = await response.json();
        
        return token

    } catch(e){

    };
};
//User el JWT para obtener datos de la API
//1. Crear identificadores para el manipular el DOM, (en la tabla)
//2. Crear función que revise el JWT y haga el llamado a la API de posts (valida el token)
//3. Si el token es válido, responder con los datos para rellenar la tabla (mediante API)
//4. ocultar el formulario para mostrarl la tabla

//---> 2.

const getPosts = async(JWT) => {
    try{
        const response = await fetch("http://localhost:3000/api/posts", {
            method: "GET",
            //el token se envía en la cabecera
            headers: {
                Authorization: `Bearer ${JWT}`
            }
        });
        const data = await response.json();
        return data;
    }catch(e){
        console.log(`Error ${e}`)
    };
};
// -->3.
const llenadoTabla = (datos) => {
    
    filasBody = document.getElementById("filas");
    filasBody.innerHTML = "";
    
    $.each(datos.data, (indice, elemento) => {
        
        filasBody.innerHTML += `<tr>
        <td>${elemento.title}</td>
        <td>${elemento.body}</td>
        </tr>
        `
    });
};
//4. Ocultar form y mostrar tabla si los datos son correctos
//4.1 Añadir un identificador al div que 
//jwt-div-form
const toggleFormTabla = (formulario,tabla) => {
    //Al indicarlos juntos, intercala el display "none" y display por default en html
    $(`#${formulario}`).toggle();
    $(`#${tabla}`).toggle();
}