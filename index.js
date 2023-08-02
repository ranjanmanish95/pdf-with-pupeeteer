const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const express = require('express');
const hbs = require('handlebars');
const path = require('path');
const data = require('./data.json');
const app = express();


// app.set("view engine", "handlebars");
// app.use(hbs);
// app.set("views", path.join(__dirname,"public"));

//compile the hbs template to pdf document 
const compile = async function(templateName, data){
  const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);

  //get the html
  const html = await fs.readFile(filePath, 'utf-8');

  return hbs.compile(html)(data);
};

(
  async function (){
    try{
     const browser = await puppeteer.launch({headless: true});
     const page = await browser.newPage();
      
     const content = await compile('index', data);

     await page.setContent(content);

     await page.pdf({
        path: 'invoice.pdf',
        format: 'A4',
        printBackground: true
     });

     console.log('pdf is generated');
     await browser.close();
     process.exit();

    } catch(e){
       console.log('our error', e);   
    }
  }  
)(); 

app.listen(8080, ()=>{
  console.log('app is listening on port 8080');
})