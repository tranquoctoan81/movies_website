const path = require('path')
const express = require('express') //gọi express từ thư viện vừa down
const app = express() //express trả vê đối tượng và đại diện cho web là app
const port = 8088 // run ở công rào
const database = require('./app/models/database'); //connect mysql
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const route = require('./app/routers/index');
database.connect()
//static file
app.use(express.static(path.join(__dirname, 'app/public')));
app.use('/admin/', express.static(path.join(__dirname, 'app/public')));
app.use('/danh-sach/', express.static(path.join(__dirname, 'app/public')));


// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


//cấu hình nhân dữ liệu từ form
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.engine('hbs', handlebars({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app/resources/views'));



//routes init
route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})