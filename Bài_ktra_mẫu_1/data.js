
let users = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        address: "175 Tây Sơn, Hà Nội",
        phone: "0123456788"
    },
    {
        id: 2,
        name: "Nguyễn Văn B",
        email: "nguyenvanb@example.com",
        address: "176 Thanh Xuân, Hà Nội",
        phone: "0912345678"
    },
    {
        id: 3,
        name: "Nguyễn Văn C",
        email: "ngvanc@example.com",
        address: "177 Nguyễn trãi, Hà Nội",
        phone: "0982121312"
    },
    {
        id: 4,
        name: "Phạm Thuỳ Dương",
        email: "phamthuyduong@example.com",
        address: "105 Bát Tràng, Hà Nội",
        phone: "03682232492"
    },
    {
        id: 5,
        name: "Trần Văn D",
        email: "tranvand@example.com",
        address: "202 Bát Khối, Long Biên, Hà Nội",
        phone: "0965432101"
    },
    {
        id: 6,
        name: "Đỗ Kim Ngân",
        email: "dokimngan@example.com",
        address: "303 Sóc Sơn, Ha Noi",
        phone: "0934567890"
    },
    {
        id: 7,
        name: "Nguyễn Phương Hoa",
        email: "phoa205@example.com",
        address: "Van Hội,Văn Bính,Thường Tín Hà Nội",
        phone: "030000000"
    },
    
];


// Các phần tử DOM
const employeeTableBody = document.getElementById('employeeTableBody');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const deleteBtn = document.getElementById('Delete-btn');
const addBtn = document.getElementById('Add-btn');
const employeeModal = document.getElementById('employeeModal');
const closeModalButton = document.getElementById('closeModalButton');
const emForm = document.getElementById('emForm');
const emIdInput = document.getElementById('emId');
const emNameInput = document.getElementById('emName');
const emEmailInput = document.getElementById('emEmail');
const emAddressInput = document.getElementById('emAddress');
const emPhoneInput = document.getElementById('emPhone');
const modalTitle = document.getElementById('modalTitle');
const submitFormButton = document.getElementById('submitFormButton');
const thongbaoDiv = document.getElementById('thongbao');
const paginationButtonsContainer = document.getElementById('paginationButtons');
const showingEntriesText = document.getElementById('showingEntriesText');

// Biến phân trang
let currentPage = 1;
const rowsPerPage = 5; // Hiển thị 5 bản ghi mỗi trang

// Hàm hiển thị thông báo
function showNotification(message, isError = false) {
    thongbaoDiv.textContent = message;
    thongbaoDiv.classList.remove('hidden', 'success', 'error');
    thongbaoDiv.classList.add(isError ? 'error' : 'success');
    setTimeout(() => {
        thongbaoDiv.classList.add('hidden');
    }, 3000); // Ẩn thông báo sau 3 giây
}

// Hàm render dữ liệu vào bảng
function renderTable() {
    employeeTableBody.innerHTML = ''; // Xóa nội dung cũ
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedUsers = users.slice(startIndex, endIndex);

    if (paginatedUsers.length === 0 && users.length > 0 && currentPage > 1) {
        // Nếu trang hiện tại không có dữ liệu nhưng vẫn còn dữ liệu tổng thể, quay lại trang trước
        currentPage--;
        renderTable();
        return;
    }

    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', user.id); // Lưu ID vào thuộc tính data-id

        row.innerHTML = `
            <td>
                <input type="checkbox" class="row-checkbox" data-id="${user.id}">
            </td>
            <td>${user.name}</td>
            <td><a href="mailto:${user.email}">${user.email}</a></td>
            <td>${user.address}</td>
            <td>${user.phone}</td>
            <td class="action-cell">
                <button type="button" class="edit-btn" data-id="${user.id}">
                    ✏️
                </button>
                <button type="button" class="delete-single-btn" data-id="${user.id}">
                    🗑️
                </button>
            </td>
        `;
        employeeTableBody.appendChild(row);
    });

    // Cập nhật trạng thái của checkbox "chọn tất cả"
    updateSelectAllCheckboxState();
    // Cập nhật văn bản hiển thị số lượng bản ghi
    updateShowingEntriesText();
    // Thiết lập các nút phân trang
    setupPagination();
}

// Cập nhật văn bản "Showing X out of Y entries"
function updateShowingEntriesText() {
    const totalUsers = users.length;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalUsers);
    const currentShowing = totalUsers > 0 ? `${startIndex + 1} - ${endIndex}` : '0';
    showingEntriesText.textContent = `Showing ${currentShowing} out of ${totalUsers} entries`;
}

// Thiết lập các nút phân trang
function setupPagination() {
    paginationButtonsContainer.innerHTML = ''; // Xóa các nút cũ
    const pageCount = Math.ceil(users.length / rowsPerPage);

    // Nút Previous
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.className = `prev-next ${currentPage === 1 ? 'disabled' : ''}`;
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    paginationButtonsContainer.appendChild(prevButton);

    // Các nút số trang
    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderTable();
        });
        paginationButtonsContainer.appendChild(pageButton);
    }

    // Nút Next
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.className = `prev-next ${currentPage === pageCount || pageCount === 0 ? 'disabled' : ''}`;
    nextButton.disabled = currentPage === pageCount || pageCount === 0;
    nextButton.addEventListener('click', () => {
        if (currentPage < pageCount) {
            currentPage++;
            renderTable();
        }
    });
    paginationButtonsContainer.appendChild(nextButton);
}

// Hàm hiển thị/ẩn modal
function toggleModal(show) {
    employeeModal.style.display = show ? 'flex' : 'none';
}

// Hàm reset form
function resetForm() {
    emForm.reset();
    emIdInput.value = ''; // Xóa ID khi reset
    modalTitle.textContent = 'Thêm Nhân Viên Mới';
    submitFormButton.textContent = 'Thêm';
    submitFormButton.classList.remove('update-button');
    thongbaoDiv.classList.add('hidden'); // Ẩn thông báo
}

// Xử lý sự kiện khi click nút "Thêm Nhân Viên Mới"
addBtn.addEventListener('click', () => {
    resetForm();
    toggleModal(true);
});

// Xử lý sự kiện khi click nút đóng modal
closeModalButton.addEventListener('click', () => {
    toggleModal(false);
});

// Xử lý sự kiện khi click bên ngoài modal để đóng
window.addEventListener('click', (event) => {
    if (event.target === employeeModal) {
        toggleModal(false);
    }
});

// Xử lý submit form thêm/sửa nhân viên
emForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const id = emIdInput.value;
    const name = emNameInput.value.trim();
    const email = emEmailInput.value.trim();
    const address = emAddressInput.value.trim();
    const phone = emPhoneInput.value.trim();

    if (!name || !email || !address || !phone) {
        showNotification('Vui lòng điền đầy đủ tất cả các trường.', true);
        return;
    }

    if (id) {
        // Chế độ chỉnh sửa
        const userIndex = users.findIndex(user => user.id === parseInt(id));
        if (userIndex !== -1) {
            users[userIndex] = { id: parseInt(id), name, email, address, phone };
            showNotification('Cập nhật nhân viên thành công!');
        } else {
            showNotification('Không tìm thấy nhân viên để cập nhật.', true);
        }
    } else {
        // Chế độ thêm mới
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({ id: newId, name, email, address, phone });
        showNotification('Thêm nhân viên mới thành công!');
    }

    renderTable();
    toggleModal(false);
    resetForm();
});

// Xử lý sự kiện cho nút "Sửa" và "Xóa" trên từng hàng
employeeTableBody.addEventListener('click', (event) => {
    if (event.target.closest('.edit-btn')) {
        const userId = parseInt(event.target.closest('.edit-btn').dataset.id);
        const userToEdit = users.find(user => user.id === userId);
        if (userToEdit) {
            emIdInput.value = userToEdit.id;
            emNameInput.value = userToEdit.name;
            emEmailInput.value = userToEdit.email;
            emAddressInput.value = userToEdit.address;
            emPhoneInput.value = userToEdit.phone;

            modalTitle.textContent = `Chỉnh Sửa Nhân Viên: ${userToEdit.name}`;
            submitFormButton.textContent = 'Cập nhật';
            submitFormButton.classList.add('update-button');
            toggleModal(true);
        }
    } else if (event.target.closest('.delete-single-btn')) {
        const userId = parseInt(event.target.closest('.delete-single-btn').dataset.id);
        if (confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
            users = users.filter(user => user.id !== userId);
            renderTable();
            showNotification('Xóa nhân viên thành công!');
        }
    }
});

// Xử lý checkbox "Chọn tất cả"
selectAllCheckbox.addEventListener('change', () => {
    const isChecked = selectAllCheckbox.checked;
    document.querySelectorAll('.row-checkbox').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
});

// Cập nhật trạng thái của checkbox "Chọn tất cả" dựa trên các checkbox hàng
function updateSelectAllCheckboxState() {
    const allCheckboxes = document.querySelectorAll('.row-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    if (allCheckboxes.length > 0 && allCheckboxes.length === checkedCheckboxes.length) {
        selectAllCheckbox.checked = true;
    } else {
        selectAllCheckbox.checked = false;
    }
}

// Lắng nghe sự kiện thay đổi của từng checkbox hàng để cập nhật checkbox "Chọn tất cả"
employeeTableBody.addEventListener('change', (event) => {
    if (event.target.classList.contains('row-checkbox')) {
        updateSelectAllCheckboxState();
    }
});

// Xử lý nút "Xóa" (xóa nhiều bản ghi)
deleteBtn.addEventListener('click', () => {
    const selectedIds = Array.from(document.querySelectorAll('.row-checkbox:checked'))
                                 .map(checkbox => parseInt(checkbox.dataset.id));

    if (selectedIds.length === 0) {
        showNotification('Vui lòng chọn ít nhất một nhân viên để xóa.', true);
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} nhân viên đã chọn không?`)) {
        users = users.filter(user => !selectedIds.includes(user.id));
        renderTable();
        showNotification(`Đã xóa ${selectedIds.length} nhân viên thành công!`);
        selectAllCheckbox.checked = false; // Bỏ chọn tất cả sau khi xóa
    }
});

// Khởi tạo bảng khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});
