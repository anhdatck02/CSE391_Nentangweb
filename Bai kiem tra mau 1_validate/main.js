$(document).ready(function() {
    let employees = JSON.parse(localStorage.getItem('employees')) || employeesData;
    const itemsPerPage = 10;
    let currentPage = 1;
    let isEditing = false; 


    function saveEmployees() {
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    function showFieldError(input, message) {
        const parent = input.closest('.form-group');
        parent.find('.error-message').text(message).removeClass('hidden');
        input.addClass('error-input');
    }

    function clearFieldError(input) {
        const parent = input.closest('.form-group');
        parent.find('.error-message').text('').addClass('hidden');
        input.removeClass('error-input');
    }

    function showNotification(message, type) {
        const notification = $('#thongbao');
        notification.html(message).removeClass('hidden error success').addClass(type);
    }
    
    function validateName(name) {
        const re = /^[a-zA-Z\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ]+$/;
        return re.test(String(name));
    }

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const re = /^(0|\+84)\d{9,10}$/;
        return re.test(String(phone));
    }

    function renderTable(data) {
        const tableBody = $('#employeeTableBody');
        tableBody.empty();
        
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedData = data.slice(start, end);

        if (paginatedData.length === 0 && data.length > 0) {
            currentPage--;
            renderTable(data);
            return;
        }

        if (paginatedData.length === 0) {
            tableBody.append('<tr><td colspan="6" style="text-align: center;">Không tìm thấy nhân viên nào.</td></tr>');
            return;
        }

        paginatedData.forEach(employee => {
            const newRow = `
                <tr>
                    <td><input type="checkbox" class="employee-checkbox" data-id="${employee.id}"></td>
                    <td>${employee.name}</td>
                    <td>${employee.email}</td>
                    <td>${employee.address}</td>
                    <td>${employee.phone}</td>
                    <td class="actions-buttons">
                        <button class="edit-btn" data-id="${employee.id}">Edit</button>
                        <button class="delete-btn-row" data-id="${employee.id}">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.append(newRow);
        });
        
        updatePaginationInfo(data.length);
        renderPagination(data.length);
        updateDeleteButtonState();
    }

    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginationButtons = $('#paginationButtons');
        paginationButtons.empty();

        for (let i = 1; i <= totalPages; i++) {
            const button = $(`<button>${i}</button>`);
            if (i === currentPage) {
                button.addClass('active');
            }
            button.on('click', function() {
                currentPage = i;
                renderTable(employees);
            });
            paginationButtons.append(button);
        }
    }

    function updatePaginationInfo(totalItems) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const showingText = totalItems > 0 ? `${startIndex + 1} to ${endIndex}` : '0';
        $('#showingEntriesText').text(`Showing ${showingText} out of ${totalItems} entries`);
    }

    $('#Add-btn').on('click', function() {
        isEditing = false;
        $('#modalTitle').text('Thêm sinh viên');
        $('#submitFormButton').text('Thêm');
        $('#emForm')[0].reset();
        $('#emId').val('');
        $('#employeeModal').show();
        $('.error-message').text('').addClass('hidden');
        $('#thongbao').addClass('hidden').html('');
        $('#emForm input').removeClass('error-input');
    });

    $('.close-button').on('click', function() {
        $('#employeeModal').hide();
    });

    $(window).on('click', function(event) {
        if ($(event.target).is('#employeeModal')) {
            $('#employeeModal').hide();
        }
    });

    $('#emForm input').on('input', function() {
        clearFieldError($(this));
    });

    $('#emForm').submit(function(event) {
        event.preventDefault();

        let isValid = true;
        
        $('.error-message').text('').addClass('hidden');
        $('#emForm input').removeClass('error-input');
        $('#thongbao').addClass('hidden').html('');

        const emNameInput = $('#emName');
        const emEmailInput = $('#emEmail');
        const emAddressInput = $('#emAddress');
        const emPhoneInput = $('#emPhone');

        const emName = emNameInput.val().trim();
        const emEmail = emEmailInput.val().trim();
        const emAddress = emAddressInput.val().trim();
        const emPhone = emPhoneInput.val().trim();

        if (emName === '') {
            isValid = false;
            showFieldError(emNameInput, 'Tên sinh viên không được để trống.');
        } else if (!validateName(emName)) {
            isValid = false;
            showFieldError(emNameInput, 'Tên không được chứa số hoặc ký tự đặc biệt.');
        }

        if (emEmail === '') {
            isValid = false;
            showFieldError(emEmailInput, 'Email không được để trống.');
        } else if (!validateEmail(emEmail)) {
            isValid = false;
            showFieldError(emEmailInput, 'Địa chỉ email không hợp lệ.');
        }

        if (emAddress === '') {
            isValid = false;
            showFieldError(emAddressInput, 'Địa chỉ không được để trống.');
        }

        if (emPhone === '') {
            isValid = false;
            showFieldError(emPhoneInput, 'Số điện thoại không được để trống.');
        } else if (!validatePhone(emPhone)) {
            isValid = false;
            showFieldError(emPhoneInput, 'Số điện thoại không hợp lệ.');
        }

        if (isValid) {
            const employeeId = $('#emId').val();
            if (employeeId) {
                const employeeIndex = employees.findIndex(emp => emp.id == employeeId);
                if (employeeIndex !== -1) {
                    employees[employeeIndex] = {
                        id: parseInt(employeeId),
                        name: emName,
                        email: emEmail,
                        address: emAddress,
                        phone: emPhone
                    };
                    showNotification('Chỉnh sửa nhân viên thành công!', 'success');
                }
            } else {
                const newId = employees.length ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
                const newEmployee = {
                    id: newId,
                    name: emName,
                    email: emEmail,
                    address: emAddress,
                    phone: emPhone
                };
                employees.push(newEmployee);
                showNotification('Thêm sinh viên thành công!', 'success');
            }
            saveEmployees();
            renderTable(employees);
            $('#emForm')[0].reset();
            $('#employeeModal').hide();
        } else {
            showNotification('Vui lòng kiểm tra lại các thông tin đã nhập.', 'error');
        }
    });
    
    $('#employeeTableBody').on('click', '.edit-btn', function() {
        isEditing = true;
        const employeeId = $(this).data('id');
        const employee = employees.find(emp => emp.id == employeeId);
        
        if (employee) {
            $('#modalTitle').text('Chỉnh sửa sinh viên');
            $('#submitFormButton').text('Lưu');
            $('#emId').val(employee.id);
            $('#emName').val(employee.name);
            $('#emEmail').val(employee.email);
            $('#emAddress').val(employee.address);
            $('#emPhone').val(employee.phone);
            
            $('#employeeModal').show();
            
            $('.error-message').text('').addClass('hidden');
            $('#thongbao').addClass('hidden').html('');
            $('#emForm input').removeClass('error-input');
        }
    });

    $('#employeeTableBody').on('click', '.delete-btn-row', function() {
        const employeeId = $(this).data('id');
        if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            employees = employees.filter(emp => emp.id != employeeId);
            saveEmployees();
            renderTable(employees);
            showNotification('Đã xóa nhân viên thành công.', 'success');
        }
    });

    $('#selectAllCheckbox').on('change', function() {
        $('.employee-checkbox').prop('checked', this.checked);
        updateDeleteButtonState();
    });

    $('#employeeTableBody').on('change', '.employee-checkbox', function() {
        updateDeleteButtonState();
    });

    function updateDeleteButtonState() {
        const checkedCount = $('.employee-checkbox:checked').length;
        if (checkedCount > 0) {
            $('#Delete-btn').prop('disabled', false).css('opacity', 1);
        } else {
            $('#Delete-btn').prop('disabled', true).css('opacity', 0.5);
        }
    }

    $('#Delete-btn').on('click', function() {
        const selectedIds = $('.employee-checkbox:checked').map(function() {
            return $(this).data('id');
        }).get();

        if (selectedIds.length > 0) {
            if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} nhân viên đã chọn?`)) {
                employees = employees.filter(emp => !selectedIds.includes(emp.id));
                saveEmployees();
                renderTable(employees);
                showNotification(`Đã xóa thành công ${selectedIds.length} nhân viên.`, 'success');
                $('#selectAllCheckbox').prop('checked', false);
            }
        }
    });
    
    renderTable(employees);
});