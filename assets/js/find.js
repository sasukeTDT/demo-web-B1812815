const socket = io();

function find(){
    let mssv_find = document.getElementById("mssv_find").value;
    let name_find = document.getElementById("name_find").value;
    let tinh_find = document.getElementById("tinh_find").value;
    socket.emit("find_student", mssv_find, name_find, tinh_find);
}

socket.on("find_list", (msg_object) => {  
    let data_str = "";
   // mgs_object = JSON.parse(msg);

    for(let i = 0; i < msg_object.length; i ++) {
        let row = "<tr>" 
        + "<td>" + msg_object[i].name + "</td>"
        + "<td>" + msg_object[i].mssv + "</td>"
        + "<td>" + msg_object[i].ngaysinh + "</td>"
        + "<td>" + msg_object[i].gioitinh + "</td>"
        + "<td>" + msg_object[i].nganh + "</td>"
        + "<td>" + msg_object[i].diachi + "</td>"
        + "<td>" + msg_object[i].email+ "</td>"
        + "</tr>"
        data_str += row;
    }

    document.getElementById("table_body").innerHTML = data_str;
});