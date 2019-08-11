import admin = require('firebase-admin');
import Koa = require('koa');
import Router = require('koa-router');
import cors = require('@koa/cors');

const app = new Koa();
const protectedRouter = new Router();

const serviceAccount = require('./fund-site-db-0fdeaa1f172b.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

//user auth middleware
const userMiddleware = async (ctx, next) =>{
    let idToken = ctx.header.authorization;
    let decodedToken = await verifyToken(idToken);
    if(decodedToken){
        ctx.state.user = decodedToken;
        await next();
    }else{
        ctx.status = 403;
        ctx.body = 'ERROR, PLEASE LOG IN AGAIN';
    }
}

const verifyToken = async (idToken) => {
    try{
        let decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    }catch(error){
        return;
    }
}

//dbconn middleware
const dbconnMiddleware = async (ctx, next) =>{
    ctx.state.dbconn = admin.firestore();
    await next();
}

//routes
protectedRouter.get('/apis/getHoldings', async (ctx) => {
    const dbconn = ctx.state.dbconn;
    const docUser = ctx.query['user'];
    if (!docUser) {
        ctx.status = 500;
        ctx.body = 'PARAMETER ERROR';
        return;
    }
    const doc = await dbconn.collection('holdings').doc(docUser).get();
    if(doc){
        ctx.body = doc.data();
    }else{
        ctx.status = 500;
        ctx.body = 'DATABASE ERROR';
    }
});

protectedRouter.get('/apis/getFund', async (ctx) => {
    const dbconn = ctx.state.dbconn;
    const fund = ctx.query['fund'];
    if (!fund){
        ctx.status = 500;
        ctx.body = 'MISSING PARAMETER USER';
        return;
    }
    const doc = await dbconn.collection('funds').doc(fund).get();
    if(doc){
        ctx.body = doc.get('currentPrice');
    }else{
        ctx.status = 500;
        ctx.body = 'DATABASE ERROR';
    }
});

//apply middelwares
app.use(cors());
app.use(userMiddleware);
app.use(dbconnMiddleware);
app.use(protectedRouter.routes());
app.use(protectedRouter.allowedMethods());

app.listen(3001);


  
