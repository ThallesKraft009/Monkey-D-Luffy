import frutos from "../data/akumaNoMi.js";

const obterAkumaNoMi = async function(){
  let i = escolherNumeroAleatorio(0, 151);

  let escolhido = frutos[i];

     return {
       i: i,
       fruto: escolhido
     }
}

export { obterAkumaNoMi };


function escolherNumeroAleatorio(min, max) {
  // Gere um número aleatório entre [min, max)
  return Math.floor(Math.random() * (max - min)) + min;
}