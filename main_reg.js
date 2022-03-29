//npm install express socket.io request #cai dat socket io

const express = require('express'); // Lenh require de dua cac module co san trong nodejs
const app = express();
const server = require('http').Server(app); //Tạo server

const io = require('socket.io')(server);

const request = require('request');
const port = process.env.PORT || 8000;


app.use(express.static('assets/')); //Static cung cap ca tep tinh

/*Tra ve ket qua khi nguoi dung truy cap trang web
    + req: Yeu cau tu trang web
    + res: Tra loi
*/
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/assets/html/registration.html');
});

app.get('/ft', (req, res) => {
    res.sendFile(__dirname + '/assets/html/features.html');
});

app.get('/fd', (req, res) => {
    res.sendFile(__dirname + '/assets/html/find.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("ms1", (arg) => {
        console.log(arg); // world
    });

    socket.emit("ms2", "hello client");

    //save data
    socket.on("save_info", (arg) => {
        console.log(arg); // world
        let info = JSON.parse(arg);
        console.log(info.name);

        var mysql = require('mysql');

        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "info_db"
        });

        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "INSERT INTO student (name, mssv, ngaysinh, gioitinh, nganh, diachi, email) VALUES ('" + info.name + "','" + info.mssv + "','" + info.ngaysinh + "','" + info.gioitinh + "','" + info.nganh + "','" + info.diachi + "','" + info.email + "')";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
        });
    });

    //hien thi danh sach sinh vien
    socket.on("fetch_data", (arg) => {
        console.log(arg);

        var mysql = require('mysql');

        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "info_db"
        });

        var result_object = [];
        //var result_str;

        con.connect(function (err) {
            if (err) throw err;
            con.query("SELECT * FROM student", function (err, result, fields) {
                if (err) throw err;
                //console.log(result);
                result.forEach(element => {
                    result_object.push({ "name": element.name, "mssv": element.mssv, "ngaysinh": element.ngaysinh, "gioitinh": element.gioitinh, "nganh": element.nganh, "diachi": element.diachi, "email": element.email })
                });

                //result_str = JSON.stringify(result_object);
                socket.emit("student_list", result_object);

            });
        });

    });

    // tim sinh vien theo mssv
    socket.on("find_student", (mssv, name, tinh) => {
       // console.log(arg);
        var mysql = require('mysql');

        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "info_db"
        });
        
        var result_object = [];

        con.connect(function (err) {
            if (err) throw err;
            if (mssv == ''){
                 mssv = '%';
            }
            name_f = '%' + name + '%';
            tinh_f = '%' + tinh + '%';
            
            var sql = 'SELECT * FROM student WHERE mssv LIKE ' + mysql.escape(mssv) 
                    + 'and name LIKE ' + mysql.escape(name_f) 
                    + 'and diachi LIKE ' + mysql.escape(tinh_f); 
            con.query(sql, function (err, result) {
                if (err) throw err;
                //console.log(result);
                result.forEach(element => {
                    result_object.push({ "name": element.name, "mssv": element.mssv, "ngaysinh": element.ngaysinh, "gioitinh": element.gioitinh, "nganh": element.nganh, "diachi": element.diachi, "email": element.email })
                });

                socket.emit("find_list", result_object);
            });
        });

    });
});
//'127.0.0.1',
server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

