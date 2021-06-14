
setUserInfo();

async function setUserInfo() {

    let trSelectorTab = [].slice.call(document.querySelectorAll('#vSelector a'))
    trSelectorTab.forEach(function (triggerEl) {
        let tabTrigger = new bootstrap.Tab(triggerEl)
        triggerEl.addEventListener('click', function (event) {
            event.preventDefault()
            tabTrigger.show()
        })
    })

    await fetch('/userInfo')
        .then(response => response.json())
        .then(user => {
            let rolesStr = roles2arr(user).toString();
            document.getElementById("header_username").innerHTML = user.email;
            document.getElementById("header_roles").innerHTML = "with roles: " + rolesStr;

            let infoTBody = document.getElementById("user_info");
            infoTBody.innerHTML = "";
            let row = infoTBody.insertRow();
            let cell = row.insertCell();
            cell.innerHTML = user.id;
            cell = row.insertCell();
            cell.innerHTML = user.firstName;
            cell = row.insertCell();
            cell.innerHTML = user.lastName;
            cell = row.insertCell();
            cell.innerHTML = user.age;
            cell = row.insertCell();
            cell.innerHTML = user.email;
            cell = row.insertCell();
            cell.innerHTML = rolesStr;
        });
}

function roles2arr(user) {
    let rolesList = [];
    for (let i = 0; i < user.roles.length; i++) {
        rolesList.push(user.roles[i].name);
    }
    return rolesList;
}