import axios from 'axios';
import cheerio =require('cheerio');
import admin = require('firebase-admin');
import dayjs = require('dayjs');
import cron = require('node-cron');

const serviceAccount = require('./fund-site-db-0fdeaa1f172b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const axiosInstance = axios.create({
  headers: {'User-Agent': 
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
  });

const getToday = () => {
  return dayjs().format('YYYY-MM-DD');
}

const parseHTMLForPrice = (data : string): number => {
  let $ = cheerio.load(data);
  let fundPrice = $('span.change', '.primary-data-content').text().match(/[0-9]+\.[0-9]{2}/);
  if (fundPrice) return Number(fundPrice[0]);
  return NaN;
  }

const fetchPrice = async (fundPriceURL : string) => {
  let response = await axiosInstance.get(fundPriceURL);
  let fundPrice = parseHTMLForPrice(response['data']);
  if(isNaN(fundPrice)){
    throw "ERROR FETCHING PRICE FROM URL: " + fundPriceURL;
    }
  return fundPrice;
}

const delayRequest = () =>{
  return new Promise(resolve => {
    setTimeout(resolve, 3000, "Done");
  });
}

const updatePrice = async () => {
  try{
    let documents = await db.collection('funds').get();
    var docArray = documents.docs;
    for(let i = 0; i < docArray.length; i++){
      let fundPriceURL = docArray[i].get('site');
      let today = getToday();
      let docRef = docArray[i].ref;
      await delayRequest();
      let fundPrice = await fetchPrice(fundPriceURL);
      let dbCurrentPrice = docArray[i].get('currentPrice');
      let dbCurrentDay = docArray[i].get('currentDay');
      if (fundPrice != dbCurrentPrice && dayjs(dbCurrentDay).isBefore(dayjs())) {
        docRef.update({[today]: fundPrice});
        docRef.update({currentDay: today});
        docRef.update({currentPrice: fundPrice});
      }
    } 
    db.collection('logs').doc('dbUpdater').update({[getToday()]: 'done' });
  } catch(error) {
    db.collection('logs').doc('dbUpdater').update({[getToday()]: error });
  }
}

cron.schedule('00 30 18 * * 0-5', () => updatePrice());