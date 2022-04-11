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

        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb+srv://b1812815:AIn59P3CRrQ1ASHe@web-b1812815.dtn9n.mongodb.net/web-b1812815?retryWrites=true&w=majority";
        //var url = process.env.MONGODB_URI;;

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("web-b1812815");
            var myobj = { name: info.name, mssv: info.mssv, ngaysinh: info.ngaysinh, gioitinh: info.gioitinh, nganh: info.nganh, diachi: info.diachi, email: info.email };
            dbo.collection("student").insertOne(myobj, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });

    });

    //delete
    socket.on("delete_info", (arg) => {
        console.log(arg); // world

        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb+srv://b1812815:AIn59P3CRrQ1ASHe@web-b1812815.dtn9n.mongodb.net/web-b1812815?retryWrites=true&w=majority";
        //var url = process.env.MONGODB_URI;;

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("web-b1812815");
            var myquery = {mssv: arg};
            dbo.collection("student").deleteOne(myquery, function(err, obj) {
              if (err) throw err;
              console.log("1 document deleted");
              db.close();
            });
          });

    });

    //hien thi danh sach sinh vien
    socket.on("fetch_data", (arg) => {
        console.log(arg);

        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb+srv://b1812815:AIn59P3CRrQ1ASHe@web-b1812815.dtn9n.mongodb.net/web-b1812815?retryWrites=true&w=majority";
        //var url = process.env.MONGODB_URI;
        var result_object = [];

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("web-b1812815");
            dbo.collection("student").find({}).toArray(function (err, result) {
                if (err) throw err;
                //console.log(result);
                result.forEach(element => {
                    result_object.push({ "name": element.name, "mssv": element.mssv, "ngaysinh": element.ngaysinh, "gioitinh": element.gioitinh, "nganh": element.nganh, "diachi": element.diachi, "email": element.email })
                });

                //result_str = JSON.stringify(result_object);
                socket.emit("student_list", result_object);
                db.close();
            });
        });

    });

    // tim sinh vien theo mssv
    socket.on("find_student", (mssv, name, tinh) => {
        // console.log(arg);
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb+srv://b1812815:AIn59P3CRrQ1ASHe@web-b1812815.dtn9n.mongodb.net/web-b1812815?retryWrites=true&w=majority";
        //var url =  process.env.MONGODB_URI;
        var result_object = [];

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;

            var dbo = db.db("web-b1812815");
            var query = {
                mssv: { $regex: mssv, $options: "i" },
                name: { $regex: name, $options: "i" },
                diachi: { $regex: tinh, $options: "i" }
            }
            console.log(query.mssv);
            dbo.collection("student").find(query).toArray(function (err, result) {
                if (err) throw err;
                //console.log(result);
                result.forEach(element => {
                    result_object.push({ "name": element.name, "mssv": element.mssv, "ngaysinh": element.ngaysinh, "gioitinh": element.gioitinh, "nganh": element.nganh, "diachi": element.diachi, "email": element.email })
                });

                socket.emit("find_list", result_object);
                db.close();
            });
        });

    });
});
//'127.0.0.1',
server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

