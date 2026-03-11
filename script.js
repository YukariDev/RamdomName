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

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#nav-list a');
    const mainContent = document.querySelector('main');

    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Lấy đường dẫn từ thuộc tính href
            const href = link.getAttribute('href');
            
            // 1. Cập nhật nội dung
            await loadPage(href);
            
            // 2. Thay đổi URL trên thanh địa chỉ
            window.history.pushState({ path: href }, '', href);
        });
    });

    // Hàm tải nội dung trang
    async function loadPage(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Lấy nội dung mới từ thẻ <main> của trang vừa tải
            const newContent = doc.querySelector('main').innerHTML;
            
            // Cập nhật vào trang hiện tại
            mainContent.innerHTML = newContent;

            // Cập nhật lại class active cho menu
            updateActiveLink(url);
            
        } catch (error) {
            console.error('Lỗi khi tải trang:', error);
            // Nếu lỗi (ví dụ 404 trên GitHub), chuyển trang kiểu truyền thống để dự phòng
            window.location.href = url;
        }
    }

    function updateActiveLink(url) {
        document.querySelectorAll('#nav-list li').forEach(li => {
            const a = li.querySelector('a');
            if (a.getAttribute('href') === url) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
    }

    // Xử lý nút Back/Forward của trình duyệt
    window.addEventListener('popstate', () => {
        loadPage(window.location.pathname.split('/').pop() || 'index.html');
    });
});