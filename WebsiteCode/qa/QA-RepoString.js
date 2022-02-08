const iframeURL = "https://htmlpreview.github.io/?https://github.com/con-cs/Lena/blob/main/index.html";

function initIframe(){
    let iframe = document.getElementsByTagName('iframe');
    for (let i = 0; i < iframe.length; i++){
        iframe[i].src = iframeURL;
    }
}

initIframe();
