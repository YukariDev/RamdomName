const marker = document.querySelector('#marker');
const items = document.querySelectorAll('nav li');

function moveMarker(target) {
  // Tính toán vị trí và độ rộng của nút được chọn
  marker.style.left = target.offsetLeft + "px";
  marker.style.width = target.offsetWidth + "px";
}

items.forEach(item => {
  // 1. Hiệu ứng khi Click
  item.addEventListener('click', (e) => {
    // Xóa class active cũ và thêm vào nút mới
    items.forEach(li => li.classList.remove('active'));
    item.classList.add('active');
    
    // Di chuyển thanh mảnh theo nút được click
    moveMarker(item);
  });

  // 2. Hiệu ứng trượt tạm thời khi Hover
  item.addEventListener('mouseenter', (e) => {
    moveMarker(item);
  });
});

// Trả thanh trượt về vị trí nút Active khi không hover nữa
document.querySelector('#nav-list').addEventListener('mouseleave', () => {
  const activeItem = document.querySelector('nav li.active');
  moveMarker(activeItem);
});

// Khởi tạo vị trí ban đầu cho marker
moveMarker(document.querySelector('nav li.active'));

document.addEventListener('click', (e) => {
    const link = e.target.closest('nav a'); // Kiểm tra nếu click vào link trong nav
    if (link) {
        e.preventDefault(); // Chặn trình duyệt tải lại trang
        const url = link.getAttribute('href');
        loadPage(url);
    }
});

async function loadPage(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();

        // Tạo một trình phân tích tạm thời để lấy nội dung <main> từ trang mới
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('main').innerHTML;

        // Cập nhật nội dung vào trang hiện tại
        document.querySelector('main').innerHTML = newContent;

        // Thay đổi URL trên thanh địa chỉ mà không reload
        window.history.pushState({}, '', url);

        // Cập nhật trạng thái class "active" cho menu
        updateActiveLink(url);
    } catch (err) {
        console.error('Lỗi tải trang:', err);
    }
}

function updateActiveLink(url) {
    const navLinks = document.querySelectorAll('#nav-list li');
    navLinks.forEach(li => {
        const a = li.querySelector('a');
        if (a.getAttribute('href') === url) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });
}

// Xử lý khi người dùng nhấn nút Back/Forward của trình duyệt
window.onpopstate = () => {
    loadPage(window.location.pathname);
};