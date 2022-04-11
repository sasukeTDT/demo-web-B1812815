const socket = io();

function delete_info(mssv_de){
    socket.emit("delete_info", mssv_de);
}

socket.emit("fetch_data","please!");

socket.on("student_list", (msg_object) => {
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
        + '<td><button class="btn btn-primary" type="button" onclick="delete_info('
        +  "'" + msg_object[i].mssv + "'" + ')">Delete </button></td>'
        + "</tr>"
        data_str += row;
    }

    document.getElementById("table_body").innerHTML = data_str;


});
