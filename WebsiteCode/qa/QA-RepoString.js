const repoUrl = "https://github.com/con-cs/Lena/blob/main/WebsiteCode/index.html";

function initIframe(){
    let iframe = document.getElementsByTagName('iframe');
    for (let i = 0; i < iframe.length; i++){
        let iframeURL = "https://htmlpreview.github.io/?" + repoUrl;

        iframe[i].src = iframeURL;
    }
}

initIframe();
