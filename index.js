import readline from "readline";
import fetch from "node-fetch";
import * as cheerio from 'cheerio';
import Audic from 'audic';

const audic = new Audic('audio.mp3');
var leitor = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function observar_nivel_rio_brusque(nivel_rio_risco){
    fetch("https://defesacivil.brusque.sc.gov.br/monitoramento/tabela")
    .then((response) => response.text())
    .then(async (texto_pagina) => {
        let $ = cheerio.load(texto_pagina)

        let nivel_rio_txt = $("#example1").find('tbody td:contains(CEOPS)').next().next()[1].children[0].data
        let nivel_rio = parseFloat(nivel_rio_txt.replace(',','.'))
        let data_hora = new Date().toLocaleString("pt-br")
        if(nivel_rio > nivel_rio_risco){
            console.log(`${data_hora} nivel rio alto ${nivel_rio}`) 
            await audic.play();
        } else {
            console.log(`${data_hora} nivel rio baixo ${nivel_rio}`);
            if(audic.playing){
                await audic.pause();
            }
        }
    });
}
console.log("iniciar observação");
leitor.question("Qual o nivel de risco do rio(mts) onde voce mora?\n", function(resposta) {
    var nivel_rio_risco = parseFloat(resposta.replace(',','.'));
    observar_nivel_rio_brusque(nivel_rio_risco)
    setInterval(() => {observar_nivel_rio_brusque(nivel_rio_risco)},1000*60*1);
})
