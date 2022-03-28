const socket = io();

function save_info(){
    let name_value = document.getElementById("name").value;
    let mssv_value = document.getElementById("mssv").value;
    let ngaysinh_value = document.getElementById("ngaysinh").value;
    let gioitinh_value = document.getElementById("gioitinh").value;
    let nganh_value = document.getElementById("nganh").value;
    let diachi_value = document.getElementById("diachi").value;
    let email_value = document.getElementById("email").value;
    let info = {
        "name":name_value,
        "mssv":mssv_value,
        "ngaysinh":ngaysinh_value,
        "gioitinh":gioitinh_value,
        "nganh":nganh_value,
        "diachi":diachi_value,
        "email":email_value
    };
    let info_str = JSON.stringify(info);
   // document.getElementById("test_code").innerHTML = info_str;
    socket.emit("save_info", info_str);
}