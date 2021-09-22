import * as restify from 'restify';
import { version } from 'typescript';

const server = restify.createServer({
    name: 'meat-api',
    version: '1.0.0'
})

server.use(restify.plugins.queryParser())

//Posso criar um array de callback
server.get('/info', [
    (req, resp, next) => {
        if (req.userAgent() && req.userAgent().includes('MSI 7.0')) {
           // resp.status(400)
           // resp.json({message: 'Please, update your brower'})
           let error: any = new Error()
           error.statusCode = 400
           error.message = 'Please, update your brower'
           return next(error)
        }
        return next();
    },

    (req, resp, next) => {
    //resp.send(400)
    resp.json({
        browser: req.userAgent(),
        method: req.method,
        url: req.href(),
        path: req.path(),
        query: req.query
    })
    return next()
}])

server.listen(3000, ()=>{
    console.log('API is running on http://localhost:3000');
    
})