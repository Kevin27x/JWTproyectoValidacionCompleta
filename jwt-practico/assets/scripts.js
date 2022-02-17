//1. id y for del formulario cambiados.
//2.Capturar evento submit y los datos del formulario (en este caso jquery)
//3. capturar inputs

$("#jwt-formulario").submit(async(event) => {
    
    event.preventDefault();
    const email = document.getElementById("jwt-email").value;
    const password = document.getElementById("jwt-password").value;
    //guardar el token en JWT. Necesita un AWAIT Y UN ASYNC (a la función padres)
    const JWT = await postData(email, password);
    getPosts(JWT);

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
        localStorage.setItem('jwt-token', token); //-----> paso 5. Almacena el token en local storage
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
        if (data){
            llenadoTabla(data);
            toggleFormTabla("jwt-div-form","jwt-tabla" );
        }
        //return data;
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
    //Al indicarlos juntos, alterna la visibilidad
    $(`#${formulario}`).toggle();
    $(`#${tabla}`).toggle();
}
//--- Persistir JWT -------------------------------
//5. Guardar el JWT en localstorage, después de hacer login (localstorage es un objeto)
//6. AL momento de cargar nuestra pagina revisar si existe un JWT, de existir debemos mostrar la tabla y ocultar el formulario
//7 Controlar la vigencia del token. Es decir, Mostrar el formulario si el token expira.
//--------------------------------------------
//6.
const inicio = async() => {
    const token = localStorage.getItem("jwt-token");
    if(token){
        //dispara la petición con el token en el header. Retorna la data de petición
        //const resultado = await getPosts(token);
        getPosts(token)
        //dispara la función que rellena la tabla con los datos obtenidos de la petición
        
    };
};
//Comprueba si existe token en localstorage
inicio();