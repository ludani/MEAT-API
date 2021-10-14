import * as restify from 'restify';
import { environment } from '../common/environment';
import { Router } from '../common/router';

export class Server {

    application: restify.Server;

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: "meat-api",
          version: "1.0.0",
        });

        this.application.use(restify.plugins.queryParser());

        //routes
        for (let router of routers) {
          router.applyRoutes(this.application)
        }

        this.application.get('/info', [
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
            },(req, resp, next) => {
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

        this.application.listen(environment.server.port, ()=>{
            resolve(this.application);
            
        })
      }catch (error) {
        reject(error);
      }
    });
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initRoutes(routers).then(() => this);
  }
}
