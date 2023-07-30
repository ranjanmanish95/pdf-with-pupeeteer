const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const data = require('./data.json');

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
     const browser = await puppeteer.launch({headless: false});
     const page = await browser.newPage();
      
     const content = await compile('index', data);

     await page.setContent(content);

     await page.pdf({
        path: 'invoice.pdf',
        format: 'A4',
        printBackground: true
     });

     console.log('done');
     await browser.close();
     process.exit();

    } catch(e){
       console.log('our error', e);   
    }
  }  
)(); 