onLoad();

function onLoad() {
    setOptionRoles();
    showAllUsers();

    let trAdminTab = [].slice.call(document.querySelectorAll('#adminTabs button'))
    trAdminTab.forEach(function (triggerEl) {
        let tabTrigger = new bootstrap.Tab(triggerEl)

        triggerEl.addEventListener('click', function (event) {
            event.preventDefault()
            tabTrigger.show()
        })
    })

    bootstrap.Tab.getInstance(document.querySelector('#vSelectorAdmin')).show();
}

async function showAllUsers() {
    let usersListTBody = document.getElementById("usersListTab");
    usersListTBody.innerHTML = "";
    fetch('/admin/getAllUsers')
        .then(response => response.json())
        .then(users => {
            users.forEach(function (user) {
                addRow2UsersTable(user)
            });
        });
}

async function addNewUser() {
    let firstName = document.getElementById('newuserFirstName').value;
    let lastName = document.getElementById('newuserLastName').value;
    let age = document.getElementById('newuserAge').value;
    let email = document.getElementById('newuserEmail').value;
    let password = document.getElementById('newuserPassword').value;
    let userRoles = [];
    Array.from(document.getElementById('newuserRole').options).forEach(option => {
        if (option.selected) {
            userRoles.push(option.value);
        }
    })

    let response = await fetch('/admin/addUser', {
        method: 'POST',
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: userRoles
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    let newUserId = await response.text();

    let roles = [];
    if (userRoles.length === 0) {
        userRoles.push("USER")
    }
    userRoles.forEach(role => roles.push(new Object({name: role})));
    addRow2UsersTable({
        id: newUserId,
        firstName: firstName,
        lastName: lastName,
        age: age,
        email: email,
        roles: roles
    });

    document.getElementById('newuserFirstName').value = "";
    document.getElementById('newuserLastName').value = "";
    document.getElementById('newuserAge').value = "";
    document.getElementById('newuserEmail').value = "";
    document.getElementById('newuserPassword').value = "";
    Array.from(document.getElementById('newuserRole').options).forEach(option => {
        option.selected = false;
    })

    bootstrap.Tab.getInstance(document.querySelector('#userTabBtn')).show()
}

async function setOptionRoles() {
    let selRolesNew = document.getElementById("newuserRole");
    let selRolesEdit = document.getElementById("edituserRole");
    let selRolesDel = document.getElementById("deluserRole");
    selRolesNew.innerHTML = "";
    selRolesEdit.innerHTML = "";
    fetch('/admin/getAllRoles')
        .then(response => response.json())
        .then(roles => {
            roles.forEach(function (role) {
                let optEdit = document.createElement('option');
                let optNew = document.createElement('option');
                let optDel = document.createElement('option');
                optEdit.value = role.name;
                optEdit.label = role.name;
                optNew.value = role.name;
                optNew.label = role.name;
                optDel.value = role.name;
                optDel.label = role.name;
                selRolesEdit.appendChild(optEdit);
                selRolesNew.appendChild(optNew);
                selRolesDel.appendChild(optDel);
            });
        });
}

async function showDeleteUser(id) {
    fetch("/admin/user/" + id)
        .then(response => response.json())
        .then(user => {
            console.log("We receive user: " + user);
            document.getElementById("deluserFirstName").value = user.firstName;
            document.getElementById("deluserLastName").value = user.lastName;
            document.getElementById("deluserAge").value = user.age;
            document.getElementById("deluserEmail").value = user.email;

            let roles = roles2arr(user);
            let rolesOption = document.getElementById("deluserRole");
            Array.from(rolesOption.options).forEach(option => {
                option.selected = roles.includes(option.value);
            })

            document.getElementById("delButton").setAttribute("onClick", "deleteUser(" + user.id + ")");
            let delUserModal = new bootstrap.Modal(document.getElementById("deleteUser"));
            delUserModal.show();
        });
}

async function deleteUser(id) {
    await fetch("/admin/deleteUser/" + id, {
        method: 'DELETE',
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })

    document.getElementById("userTabRow_" + id).remove();
    let delUserModal = bootstrap.Modal.getInstance(document.getElementById("deleteUser"));
    delUserModal.hide();
}

async function showEditUser(id) {
    fetch("/admin/user/" + id)
        .then(response => response.json())
        .then(user => {
            console.log("We receive user: " + user);
            document.getElementById('edituserId').value = user.id;
            document.getElementById('edituserFirstName').value = user.firstName;
            document.getElementById('edituserLastName').value = user.lastName;
            document.getElementById('edituserAge').value = user.age;
            document.getElementById('edituserEmail').value = user.email;

            let roles = roles2arr(user);
            let rolesOption = document.getElementById("edituserRole");
            Array.from(rolesOption.options).forEach(option => {
                option.selected = roles.includes(option.value);
            })

            document.getElementById("editButton").setAttribute("onClick", "editUser(" + user.id + ")");
            let editUserModal = new bootstrap.Modal(document.getElementById("editUser"));
            editUserModal.show();
        });
}

async function editUser(id) {
    let userId = document.getElementById('edituserId').value;
    let firstName = document.getElementById('edituserFirstName').value;
    let lastName = document.getElementById('edituserLastName').value;
    let age = document.getElementById('edituserAge').value;
    let email = document.getElementById('edituserEmail').value;
    let password = document.getElementById('edituserPassword').value;
    let userRoles = [];
    for (let option of document.getElementById('edituserRole').options) {
        if (option.selected) {
            userRoles.push(option.value);
        }
    }
    if (userRoles.length === 0) {
        userRoles.push("USER")
    }

    let response = await fetch('/admin/editUser', {
        method: 'PATCH',
        body: JSON.stringify({
            id: userId,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: userRoles
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    let userRow = document.getElementById("userTabRow_" + userId);
    userRow.innerHTML = "";
    userRow.setAttribute('id', "userTabRow_" + userId);
    let cell = userRow.insertCell();
    cell.innerHTML = userId;
    cell = userRow.insertCell();
    cell.innerHTML = firstName;
    cell = userRow.insertCell();
    cell.innerHTML = lastName;
    cell = userRow.insertCell();
    cell.innerHTML = age;
    cell = userRow.insertCell();
    cell.innerHTML = email;
    cell = userRow.insertCell();
    cell.innerHTML = userRoles.toString();
    cell = userRow.insertCell();
    cell.innerHTML = '<button class="btn btn-sm btn-info" type="button" onclick="showEditUser(' + userId + ')">Edit</button>';
    cell = userRow.insertCell()
    cell.innerHTML = '<button class="btn btn-sm btn-danger" type="button" onclick="showDeleteUser(' + userId + ')">Delete</button>'

    let editUserModal = bootstrap.Modal.getInstance(document.getElementById("editUser"));
    editUserModal.hide();
}


function addRow2UsersTable(user) {
    let usersListTBody = document.getElementById("usersListTab");
    let row = usersListTBody.insertRow(-1);
    row.setAttribute('id', "userTabRow_" + user.id);
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
    cell.innerHTML = roles2arr(user).toString();
    cell = row.insertCell();
    cell.innerHTML = '<button class="btn btn-sm btn-info" type="button" onclick="showEditUser(' + user.id + ')">Edit</button>';
    cell = row.insertCell()
    cell.innerHTML = '<button class="btn btn-sm btn-danger" type="button" onclick="showDeleteUser(' + user.id + ')">Delete</button>'
}
