const path         = require('path');
const ConfigLoader = require('app-config-node');
const container    = require('./core/Container');
const env          = require('./services/Env');
const app          = require('./core/App');

const config  = new ConfigLoader()
    .load(__dirname + `/config/config_${env.get()}.yml`)
    .load((config) => {
        return {
            root: path.normalize(path.join(path.dirname(require.main.filename), '../')),
            app : {
                port : config.server.port || process.env.PORT || 7755,
            }
        }
    })
    .getConfig();

container.set('env', env);
container.set('config', config);

app.setContainer(container);

//HTTP
app.addHttpRoute('/',   require('./actions/http/staticFiles'));// Must be at the end
//WEBSOCKET
app.addWebsocketRoute('item.add', require('./actions/ws/item.add'));

app.handle();


