document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");
    const contactList = document.getElementById("contact-list");

    // 加载联系人列表
    function loadContacts() {
        fetch("http://localhost:3000/contacts")
            .then(response => response.json())
            .then(data => {
                contactList.innerHTML = ""; // 清空列表
                data.forEach(contact => {
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <p>${contact.name} - ${contact.email} - ${contact.phone}</p>
                        <button onclick="deleteContact(${contact.id})">删除</button>
                        <button onclick="editContact(${contact.id}, '${contact.name}', '${contact.email}', '${contact.phone}')">编辑</button>
                    `;
                    contactList.appendChild(div);
                });
            })
            .catch(error => console.log(error));
    }

    // 添加联系人
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        fetch("http://localhost:3000/contacts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone })
        })
        .then(() => {
            contactForm.reset();
            loadContacts();
        })
        .catch(error => console.log(error));
    });

    // 删除联系人
    window.deleteContact = function (id) {
        fetch(`http://localhost:3000/contacts/${id}`, { method: "DELETE" })
            .then(() => loadContacts())
            .catch(error => console.log(error));
    };

    // 编辑联系人
    window.editContact = function (id, name, email, phone) {
        document.getElementById("name").value = name;
        document.getElementById("email").value = email;
        document.getElementById("phone").value = phone;
        
        contactForm.onsubmit = function(e) {
            e.preventDefault();
            fetch(`http://localhost:3000/contacts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    phone: document.getElementById("phone").value
                })
            })
            .then(() => {
                contactForm.reset();
                contactForm.onsubmit = addContact; // 恢复原来的添加联系人功能
                loadContacts();
            })
            .catch(error => console.log(error));
        };
    };

    loadContacts(); // 初始加载联系人列表
});
