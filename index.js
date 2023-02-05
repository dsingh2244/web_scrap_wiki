import axios from "axios";
import * as cheerio from "cheerio";
import readline from "readline-sync";

// To start program normally run the index.js file and give input 

console.log("Enter a URL to Wikipedia Page:")

const url =String(readline.question());
// EX:- https://en.wikipedia.org/wiki/Web_scraping

console.log("Wait a sec...")

const datalist=[]


axios(url).then(res=>{
    const html=res.data 
    const $=cheerio.load(html);
    $('a',html).each(function(){
        const chlink=$(this).attr('href').startsWith("/wiki/")
        if(chlink){
            const hlink=$(this).attr('href');
            var obj= new Object();
            obj.title=$(this).text().trim();
            const url1=`https://en.wikipedia.org${hlink}`
            axios(url1).then(res1=>{
                const html1=res1.data 
                const $1=cheerio.load(html1);
                const hlink1=$1("#t-info > a",html1).attr('href')
                const url2=`https://en.wikipedia.org${hlink1}`
                axios(url2).then(res2=>{
                    const html2=res2.data 
                    const $2=cheerio.load(html2);
                    const hlink2=$2('#mw-pageinfo-edits > td:nth-child(2)',html2).text().trim().split(",");
                    var x="";
                    for(const i of hlink2){
                        x+=i;
                    }
                    obj.edits=Number(x);
                    datalist.push(obj);
                    datalist.sort(function(a, b){return b.edits - a.edits});
                    console.log(datalist);
                }).catch(err=>{});
            }).catch(err=>{});
        }
    })
}).catch(err=>{});
