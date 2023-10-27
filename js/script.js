function Seguro(anio, equipo, tipoDeSeguro, casoEvento) {
    this.anio = anio;
    this.equipo = equipo;
    this.tipoDeSeguro = tipoDeSeguro;
    this.casoEvento = casoEvento;
}

//realizaremos cotizacion del seguro con los datos
Seguro.prototype.cotizarSeguro = function(){

    // leer equipo
    const equipo = parseFloat(document.querySelector('#equipo').value);

    // Leer año
    const anio = parseFloat(document.querySelector('#anio').value);

    // Leer tipo de seguro
    const tipoDeSeguro = parseFloat(document.querySelector('#tipoDeSeguro').value);
    
    // Leer evento sobre el equipo
    const casoEvento = parseFloat(document.querySelector('#casoEvento').value);

    // Calcular el resultado
    let resultado = equipo * (anio + casoEvento + tipoDeSeguro);
    resultado = Math.round(resultado);

    return resultado;

}

// funcion para utilizar con los prototypes
function UI(){
}

//proto - function para mostrar mensaje de la resolucion de los campos
UI.prototype.mostrarMensaje = function(mensaje, tipo){

    const div = document.createElement('div');

    if(tipo === 'error'){
        div.classList.add('error')
    }else{
        div.classList.add('correcto');
        //insertamos en el HTML
    }

    div.classList.add('mensaje', 'mt-10')
    div.textContent = mensaje;
    
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.before(div, document.querySelector('#resultado') )

    setTimeout(() => {
        div.remove();
    }, 3000);
}

//Mostrar resultado en el div emergente
UI.prototype.mostrarResultado = async (totalPesos,totalDolares,seguro) => {
    
    const {anio, casoEvento} = seguro

    const equipo = document.querySelector('#equipo').options[document.querySelector('#equipo').selectedIndex].text;
    const tipoDeSeguro = document.querySelector('#tipoDeSeguro').options[document.querySelector('#tipoDeSeguro').selectedIndex].text;

    //mostrar resultado 
    const div = document.createElement('div');
    div.classList.add('resumen');

    div.innerHTML = `
                    <p class="header">Tu resumen <p>
                    <p class="font-bold">Equipo: ${equipo}<p>
                    <p class="font-bold">Tipo de seguro: ${tipoDeSeguro}<p>
                    <p class="font-bold">Total en pesos: $${totalPesos}<p>
                    <p class="font-bold">Total en dolares: $${totalDolares.toFixed(2)}<p>
                    `;
    
    const resultadoDiv = document.querySelector('#resultado')
    resultadoDiv.appendChild(div)
}

const ui = new UI();

eventListeners();
async function eventListeners(){
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.addEventListener("submit", cotizarSeguro);

    async function cotizarSeguro(e){
        e.preventDefault();

        //leer equipo
        const equipo = document.querySelector('#equipo').value;

        //leer año
        const anio = document.querySelector('#anio').value;

        //leer tipo de seguro
        const tipoDeSeguro = document.querySelector('#tipoDeSeguro').value;
        
        //leer evento sobre el equipo
        const casoEvento = document.querySelector('#casoEvento').value;

        if(equipo === '' || anio === '' || tipoDeSeguro === '' || casoEvento === '' || (isNaN(equipo) || isNaN(anio) || isNaN(tipoDeSeguro) || isNaN(casoEvento) || anio === 0 || equipo === 0 || tipoDeSeguro === 0 || casoEvento === 0)){
            ui.mostrarMensaje('Todos los campos son obligatorios', 'error')
        }else{
            ui.mostrarMensaje('Cotizando', 'exito');

            const resultados = document.querySelector('#resultado div')

            if (resultados != null) {
                resultados.remove();
            }


            const seguro = new Seguro(equipo, anio, tipoDeSeguro, casoEvento);
            const totalPesos = seguro.cotizarSeguro()
            const totalDolares = await conversionDolares(totalPesos)

            setTimeout(() => { ui.mostrarResultado(totalPesos, totalDolares, seguro);
            }, 3000)
        }
    }   
}

const conversionDolares = async (totalPesos) =>{
    const response = await dolarCotizacionApi();
    const dolarBlue = response.venta

    return totalPesos / dolarBlue;

}


const dolarCotizacionApi = async () => {
 const response = await fetch("https://dolarapi.com/v1/dolares/blue")
   //console.log(response.json());
   return response.json();
}
