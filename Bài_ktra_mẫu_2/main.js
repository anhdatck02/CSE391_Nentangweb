// data.js phải được import trước và biến `transactions` phải được khai báo toàn cục
// Giả định `transactions` đã được định nghĩa trong data.js

// Lấy các phần tử DOM cần thiết cho modal Thêm/Sửa
const addModal = document.getElementById("addTransactionModal");
const openModalBtn = document.querySelector(".transaction-header .btn-primary");
const closeModalBtn = document.querySelector("#addTransactionModal .close-btn");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("addTransactionForm");

// Lấy các phần tử DOM cho modal Xem chi tiết
const detailModal = document.getElementById("detailModal");
const closeDetailModalBtn = document.getElementById("closeDetailModalBtn");
const closeDetailBtn = document.getElementById("closeDetailBtn");
const detailId = document.getElementById("detailId");
const detailKhachhang = document.getElementById("detailKhachhang");
const detailNhanvien = document.getElementById("detailNhanvien");
const detailSotien = document.getElementById("detailSotien");
const detailNgaymua = document.getElementById("detailNgaymua");


const transactionTableBody = document.querySelector(".transaction-table tbody");
const transactionTable = document.querySelector(".transaction-table");

// Các trường input và các phần tử hiển thị lỗi trong form Thêm/Sửa
const khachhangInput = document.getElementById("khachhang");
const nhanvienInput = document.getElementById("nhanvien");
const sotienInput = document.getElementById("sotien");

const khachhangError = document.getElementById("error-khachhang");
const nhanvienError = document.getElementById("error-nhanvien");
const sotienError = document.getElementById("error-sotien");

// Biến để lưu trữ ID của bản ghi đang được chỉnh sửa
let editingId = null;

// Hàm để render dữ liệu ra bảng
function renderTransactions() {
    transactionTableBody.innerHTML = '';
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', transaction.id);
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon blue edit-btn"><i class="fas fa-pen"></i></button>
                    <button class="btn-icon yellow view-btn"><i class="fas fa-info-circle"></i></button>
                    <button class="btn-icon red delete-btn"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
            <td>${transaction.id}</td>
            <td>${transaction.customer}</td>
            <td>${transaction.employee}</td>
            <td>${transaction.amount.toLocaleString('vi-VN')}</td>
            <td>${transaction.date}</td>
        `;
        transactionTableBody.appendChild(row);
    });
    }

    // Gọi hàm render ngay lập tức khi script được tải
    renderTransactions();

    // Xử lý sự kiện mở/đóng modal Thêm/Sửa
    openModalBtn.addEventListener('click', () => {
        form.reset();
        editingId = null;
        document.querySelector('#addTransactionModal .modal-header h2').textContent = 'Thêm giao dịch';
        document.getElementById('addBtn').textContent = 'Thêm';
        addModal.style.display = "block";
    });

    closeModalBtn.addEventListener('click', () => {
        addModal.style.display = "none";
    });

    cancelBtn.addEventListener('click', () => {
        addModal.style.display = "none";
    });

    // Xử lý sự kiện đóng modal Xem chi tiết
    closeDetailModalBtn.addEventListener('click', () => {
        detailModal.style.display = "none";
    });

    closeDetailBtn.addEventListener('click', () => {
        detailModal.style.display = "none";
    });

    // Xử lý sự kiện click ra ngoài modal
    window.addEventListener('click', (event) => {
        if (event.target === addModal) {
            addModal.style.display = "none";
        }
        if (event.target === detailModal) {
            detailModal.style.display = "none";
        }
    });

    // Hàm xác thực dữ liệu
    function validateForm() {
        let isValid = true;
        khachhangError.textContent = '';
        nhanvienError.textContent = '';
        sotienError.textContent = '';

        const khachhangValue = khachhangInput.value.trim();
        const nhanvienValue = nhanvienInput.value.trim();
        const sotienValue = sotienInput.value.trim();

        if (khachhangValue === '') {
            khachhangError.textContent = 'Tên khách hàng không được để trống.';
            isValid = false;
        } else if (khachhangValue.length > 30) {
            khachhangError.textContent = 'Tên khách hàng không được quá 30 ký tự.';
            isValid = false;
        }

        if (nhanvienValue === '') {
            nhanvienError.textContent = 'Tên nhân viên không được để trống.';
            isValid = false;
        } else if (nhanvienValue.length > 30) {
            nhanvienError.textContent = 'Tên nhân viên không được quá 30 ký tự.';
            isValid = false;
        }
        
        if (sotienValue === '') {
            sotienError.textContent = 'Số tiền không được để trống.';
            isValid = false;
        } else if (isNaN(sotienValue) || parseFloat(sotienValue) < 0) {
            sotienError.textContent = 'Số tiền không hợp lệ.';
            isValid = false;
        }

        return isValid;
    }

        // Xử lý sự kiện khi nhấn nút "Thêm" hoặc "Sửa" trong form
        form.addEventListener('submit', (e) => {
            e.preventDefault();

        if (validateForm()) {
            const date = new Date().toLocaleString('vi-VN', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

        if (editingId !== null) {
            const transactionIndex = transactions.findIndex(t => t.id === editingId);
            if (transactionIndex !== -1) {
                transactions[transactionIndex].customer = khachhangInput.value.trim();
                transactions[transactionIndex].employee = nhanvienInput.value.trim();
                transactions[transactionIndex].amount = parseFloat(sotienInput.value.trim());
                transactions[transactionIndex].date = date;
            }
            editingId = null;
            alert('Dữ liệu đã được cập nhật thành công!');
        } else {
            const newTransaction = {
                id: Math.floor(Math.random() * 10000) + 1,
                customer: khachhangInput.value.trim(),
                employee: nhanvienInput.value.trim(),
                amount: parseFloat(sotienInput.value.trim()),
                date: date
            };
            transactions.push(newTransaction);
            alert('Dữ liệu đã được thêm thành công!');
        }
        
        renderTransactions();
        addModal.style.display = "none";
        form.reset();
    }
});

        // Event Delegation cho nút SỬA, XÓA và XEM CHI TIẾT
        transactionTableBody.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const row = target.closest('tr');
        const id = parseInt(row.getAttribute('data-id'));
        const transaction = transactions.find(t => t.id === id);

    if (target.classList.contains('delete-btn')) {
        // Chức năng XÓA
        if (confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
            const transactionIndex = transactions.findIndex(t => t.id === id);
            transactions.splice(transactionIndex, 1);
            renderTransactions();
        }
    } else if (target.classList.contains('edit-btn')) {
        // Chức năng SỬA
        khachhangInput.value = transaction.customer;
        nhanvienInput.value = transaction.employee;
        sotienInput.value = transaction.amount;
        
        editingId = id;
        document.querySelector('#addTransactionModal .modal-header h2').textContent = 'Sửa giao dịch';
        document.getElementById('addBtn').textContent = 'Lưu';

        addModal.style.display = "block";
    } else if (target.classList.contains('view-btn')) {
        // Chức năng XEM CHI TIẾT
        detailId.textContent = transaction.id;
        detailKhachhang.textContent = transaction.customer;
        detailNhanvien.textContent = transaction.employee;
        detailSotien.textContent = transaction.amount.toLocaleString('vi-VN');
        detailNgaymua.textContent = transaction.date;

        detailModal.style.display = "block";
    }
});