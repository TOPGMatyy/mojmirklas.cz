  function setContentSize() { 
                                                                                                                                                         
    var content = document.getElementById('content');                
    var footerHeight = document.getElementById('footer').offsetHeight;
    var illustrationHeight = document.getElementById('illustration').offsetHeight;

    var webPage = content.offsetHeight + footerHeight + illustrationHeight + 130 ;
   
    var windowHeight = 0;

    if (window.innerHeight)
    {
       windowHeight = window.innerHeight;
    }
    else
    {
       windowHeight = document.documentElement.clientHeight;
    }
    
    if (webPage < windowHeight)
    {
       content.style.height = windowHeight - footerHeight - illustrationHeight - 130 - 12 + 'px';
    }
  
  }