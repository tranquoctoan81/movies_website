const path = require('path')
const express = require('express') //gọi express từ thư viện vừa down
const app = express() //express trả vê đối tượng và đại diện cho web là app
const port = 3000 // run ở công rào
const database = require('./app/models/database'); //connect mysql
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const route = require('./app/routers/index');
const cookieParser = require('cookie-parser')
database.connect()


app.use(cookieParser())
//static file
app.use(express.static(path.join(__dirname, 'app/public')));
app.use('/admin/', express.static(path.join(__dirname, 'app/public')));
app.use('/danh-sach/', express.static(path.join(__dirname, 'app/public')));
app.use('/admin/:slug', express.static(path.join(__dirname, 'app/public')));
app.use('/year/:year', express.static(path.join(__dirname, 'app/public')));
app.use('/update-info/:name', express.static(path.join(__dirname, 'app/public')));
app.use('/country/:country', express.static(path.join(__dirname, 'app/public')));
app.use('/categories/:catName', express.static(path.join(__dirname, 'app/public')));


// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


//cấu hình nhân dữ liệu từ form
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.engine('hbs', handlebars({
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a + b,
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app/resources/views'));


//routes init
route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})