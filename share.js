 //<!-- Script para compartir -->
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
  
    document.querySelector('.facebook').addEventListener('click', function() {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    });
  
    document.querySelector('.twitter').addEventListener('click', function() {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
    });
  
    document.querySelector('.whatsapp').addEventListener('click', function() {
      window.open(`https://api.whatsapp.com/send?text=${title}%20${url}`, '_blank');
    });
 