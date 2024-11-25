var form = document.getElementById('novelForm');
form.addEventListener('submit', (event) => {
    // TinyMCE 데이터가 textarea에 업데이트되도록 보장
    event.preventDefault(); // 디버그용으로 기본 동작 차단 (테스트 시 제거 가능)
    tinymce.triggerSave();  // TinyMCE의 내용을 textarea로 동기화
    const formData = new FormData(form); // 폼 데이터를 가져옴
    document.getElementById('display_area').innerHTML = formData.get('title')+"<br>"+formData.get('content');

    // 실제 서버로 폼 데이터 전송 시:
    // form.submit();
});

// TinyMCE 스크립트 로드
var script = document.createElement('script');
script.src = './static/api/tinymce/tinymce.min.js'; // TinyMCE 경로
script.onload = () => {
    // TinyMCE 로딩 후 초기화
    tinymce.init({
        selector: '#editor', // 에디터를 적용할 선택자
        height: 500,          // 에디터 높이 설정
        plugins: 'lists link image table', // 사용할 플러그인
        toolbar: 'fontsize | bold italic underline | alignleft aligncenter alignright | forecolor backcolor | link image', // 툴바 구성
        content_style: `
        body {
            border-radius: 0px !important;
        }
    `,
    });
};
document.body.appendChild(script);
