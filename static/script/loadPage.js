function loadPage(url,scriptUrls=[],callback){
    fetch(url)
        .then(response => {
            if(!response.ok){
                throw new Error('Network response was not ok'+response.statusText);
            }
            return response.text();
        })
        .then(html => {
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = html;

            // 1. 기존 스크립트 제거
            clearPreviousScripts();

            // 2. 외부 스크립트 동적 로드
            scriptUrls.forEach(url => {
                loadScript(url);
            });

            // 3. HTML 내부 <script> 실행
            const inlineScripts = contentDiv.querySelectorAll('script');
            inlineScripts.forEach(script => {
                executeScript(script);
                script.remove(); // 처리 후 제거
            });

            if(callback) callback();
        })
        .catch(error => {
            console.error('Error loading page: ',error);
            document.getElementById('content').innerHTML = '<p>Failed to load page.</p>';
        });
}
// 1. 기존 스크립트 제거 (index.html 제외)
function clearPreviousScripts() {
    const scripts = document.querySelectorAll('body script');
    scripts.forEach(script => {
        // indexScript를 제외한 다른 모든 스크립트 제거
        if (script.class !== 'indexScript') {
            script.remove();
        }
    });
}

// 2. 외부 스크립트 로드 함수
function loadScript(scriptUrl) {
    const script = document.createElement('script');
    script.class = "outerScript";
    script.src = scriptUrl;
    //script.defer = true;
    document.body.appendChild(script);
}

// 3. HTML 내부 <script> 실행 함수
function executeScript(script) {
    // const newScript = document.createElement('script');
    // if (script.src) {
    //     newScript.class = "innerScript";
    //     newScript.src = script.src;
    //     newScript.defer = true;
    // } else {
    //     newScript.textContent = script.textContent;
    // }
    // document.head.appendChild(newScript);
}