import fetch from "node-fetch";
import * as cheerio from 'cheerio';
import inquirer from 'inquirer';
import Audic from 'audic';

const audic = new Audic('audio.mp3');


function observar_nivel_rio_brusque(nivel_rio_risco, local_monitoramento){
    let data_hora = new Date().toLocaleString("pt-br")

    try{
        fetch("https://defesacivil.brusque.sc.gov.br/monitoramento/tabela")
        .then((response) => response.text())
        .then(async (texto_pagina) => {
            let $ = cheerio.load(texto_pagina)

            let nivel_rio_txt = $("#example1").find(`tbody td:contains(${local_monitoramento})`).next().next().next().text()
            let nivel_rio = parseFloat(nivel_rio_txt.replace(',','.'))
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
    } catch (e) {
        console.log(`${data_hora} Não foi possível obter nível do rio`)
    }
}

console.log("inicianado sistema de observação...");

fetch("https://defesacivil.brusque.sc.gov.br/monitoramento/tabela")
.then((response) => response.text())
.then(async (texto_pagina) => {
    let $ = cheerio.load(texto_pagina)
    let locais = $("#example1").find('tbody tr td:first-child').map((x,y) => y.children[1].children[0].data.trim()).toArray();
    console.log(locais)
    inquirer.prompt(
        [
            {message:'Escolha a estação para monitoramento: ',choices:locais, name:'local_monitoramento', type:'list'},
            {message:'Qual o nivel de risco do rio(mts) para gerar alerta sonoro? ', name:'nivel_risco', type:'input'}
    ]
    ).then((respostas) => {
        console.log(respostas)
        var nivel_rio_risco = parseFloat(respostas['nivel_risco'].replace(',','.'));
        observar_nivel_rio_brusque(nivel_rio_risco, respostas['local_monitoramento'])
        setInterval(() => {observar_nivel_rio_brusque(nivel_rio_risco, respostas['local_monitoramento'])},1000*60*1);
    })
})

