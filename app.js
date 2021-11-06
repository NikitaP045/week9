export default function appScr(express, bodyParser, fs, crypto, http, m, puppeteer, CORS, User) {
    const app = express();
    const hd = {'Content-Type':'text/html; charset=utf-8'}
    
    let headers = {
        'Content-Type':'text/plain',
        ...CORS
    }
    return app
        .use(bodyParser.urlencoded({extended:true}))  
        
        .all('/login/', (req, res) => {
            res.set(headers)
            res.send('itmo311347');
        })
        .all('/code/', (req, res) => {
            res.set(headers)
            fs.readFile(import.meta.url.substring(7),(err, data) => {
                if (err) throw err;
                res.end(data);
              });           
        })
        .all('/sha1/:input/', (req, res) => {
            res.set(headers)
            let sha = crypto.createHash('sha1')
            res.send(sha.update(req.params.input).digest('hex'))
        })
        .get('/req/', (req, res) =>{
            res.set(headers);
            let data = '';
            http.get(req.query.addr, async function(response) {
                await response.on('data',function (chunk){
                    data+=chunk;
                }).on('end',()=>{})
                res.send(data)
            })
        })
        .post('/req/', (req, res) =>{
            res.set(headers);
            let data = '';
            http.get(req.body.addr, async function(response) {
                await response.on('data',function (chunk){
                    data+=chunk;
                }).on('end',()=>{})
                res.send(data)
            })
        })
        .post('/insert/', async r=>{
            r.res.set(headers);
            const {login,password,URL}=r.body;
            const newUser = new User({login,password});
            try{
                await m.connect(URL, {useNewUrlParser:true, useUnifiedTopology:true});
                try{
                    await newUser.save();
                    r.res.status(201).json({'Добавлено: ':login});
                }
                catch(e){
                    r.res.status(400).json({'Ошибка: ':'Нет пароля'});
                }
            }
            catch(e){
                console.log(e.codeName);
            }      
        })
        .all('/test/', async r=>{
          r.res.set(headers);
          const {URL} = r.query;
          const browser = await puppeteer.launch({ executablePath: '/chromium', args: ['--no-sandbox'] });
            const page = await browser.newPage();
            await page.goto(URL);
            await page.waitForSelector("#inp");
            await page.click('#bt');
            const got = await page.$eval('#inp',el=>el.value);
            console.log(got);
            browser.close();
            r.res.send(got)
        })

                
        .use(({res:r})=>r.status(404).set(hd).send('itmo311347'))
}