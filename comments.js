//<!-- Script para la funcionalidad de comentarios -->

    document.addEventListener('DOMContentLoaded', function() {
        // Manejo del formulario de comentarios
        const commentForm = document.getElementById('comment-form');
        const commentsList = document.querySelector('.comments-list');
        const commentCountElement = document.getElementById('comment-count');
        let commentCount = parseInt(commentCountElement.textContent);


      // Función específica para manejar el clic en el botón de like
         function handleLikeClick(e) {
        // Evitar la propagación y comportamiento por defecto
        e.preventDefault();
        e.stopPropagation();
        
        // Verificar si ya está deshabilitado
        if (this.disabled || this.classList.contains('liked')) {
            return;
        }
        
        const likeCountElement = this.querySelector('.like-count');
        let likeCount = parseInt(likeCountElement.textContent);
        likeCount++; // Incrementar SOLO una vez
        likeCountElement.textContent = likeCount;
        
        // Marcar como liked
        this.style.color = '#66ffcc';
        this.classList.add('liked');
        this.disabled = true;
    }
       
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const name = document.getElementById('commenter-name').value;
            const email = document.getElementById('commenter-email').value;
            const text = document.getElementById('comment-text').value;
            
            if (!name || !email || !text) return;
            
            // Crear nuevo comentario
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            
            // Obtener fecha actual formateada
            const now = new Date();
            const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
            const timeOptions = { hour: '2-digit', minute: '2-digit' };
            const formattedDate = `${now.toLocaleDateString('es-ES', dateOptions)}, ${now.toLocaleTimeString('es-ES', timeOptions)}`;
            
            newComment.innerHTML = `
                <div class="comment-avatar">
                    <img src="/api/placeholder/40/40" alt="Avatar de usuario">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="commenter-name">${name}</span>
                        <span class="comment-date">${formattedDate}</span>
                    </div>
                    <div class="comment-body">
                        <p>${text}</p>
                    </div>
                    <div class="comment-actions">
                        <button class="like-btn" data-comment-id="${commentCount + 1}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"></path>
                                <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                            <span class="like-count">0</span>
                        </button>
                        <button class="reply-btn" data-comment-id="${commentCount + 1}">Responder</button>
                    </div>
                </div>
            `;
            
            // Añadir comentario al inicio de la lista
            commentsList.insertBefore(newComment, commentsList.firstChild);
            
            // Actualizar contador de comentarios
            commentCount++;
            commentCountElement.textContent = commentCount;
            
            // Resetear formulario
            commentForm.reset();
            
            // Añadir evento a los nuevos botones
            setupCommentButtons();
        });
        
        // Función para configurar los botones de comentarios
        function setupCommentButtons() {
            // Botones de "Me gusta"
            document.querySelectorAll('.like-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const likeCountElement = this.querySelector('.like-count');
                    let likeCount = parseInt(likeCountElement.textContent);
                    likeCount++;
                    likeCountElement.textContent = likeCount;
                    this.style.color = '#66ffcc';
                    this.disabled = true;
                });
            });
            
            // Botones de "Responder"
            document.querySelectorAll('.reply-btn').forEach(button => {
                button.addEventListener('click', function() {
                    // Crear formulario de respuesta
                    const commentId = this.getAttribute('data-comment-id');
                    const parentComment = this.closest('.comment-content');
                    
                    // Comprobar si ya existe un formulario de respuesta
                    const existingForm = parentComment.querySelector('.reply-form');
                    if (existingForm) {
                        existingForm.remove();
                        return;
                    }
                    
                    // Crear formulario de respuesta
                    const replyForm = document.createElement('div');
                    replyForm.className = 'comment-form reply-form';
                    replyForm.style.marginTop = '15px';
                    
                    replyForm.innerHTML = `
                        <h3>Responder a este comentario</h3>
                        <form id="reply-form-${commentId}">
                            <div class="form-group">
                                <label for="reply-name-${commentId}">Nombre:</label>
                                <input type="text" id="reply-name-${commentId}" name="reply-name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="reply-email-${commentId}">Email (no será publicado):</label>
                                <input type="email" id="reply-email-${commentId}" name="reply-email" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="reply-text-${commentId}">Respuesta:</label>
                                <textarea id="reply-text-${commentId}" name="reply-text" rows="3" required></textarea>
                            </div>
                            
                            <button type="submit" class="submit-comment">Publicar respuesta</button>
                            <button type="button" class="submit-comment" style="background-color: #777; margin-left: 10px;">Cancelar</button>
                        </form>
                    `;
                    
                    parentComment.appendChild(replyForm);
                    
                    // Manejar el envío del formulario de respuesta
                    const form = document.getElementById(`reply-form-${commentId}`);
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        const name = document.getElementById(`reply-name-${commentId}`).value;
                        const text = document.getElementById(`reply-text-${commentId}`).value;
                        
                        if (!name || !text) return;
                        
                        // Crear nueva respuesta
                        const newReply = document.createElement('div');
                        newReply.className = 'comment reply';
                        
                        // Obtener fecha actual formateada
                        const now = new Date();
                        const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
                        const timeOptions = { hour: '2-digit', minute: '2-digit' };
                        const formattedDate = `${now.toLocaleDateString('es-ES', dateOptions)}, ${now.toLocaleTimeString('es-ES', timeOptions)}`;
                        
                        newReply.innerHTML = `
                            <div class="comment-avatar">
                                <img src="/api/placeholder/40/40" alt="Avatar de usuario">
                            </div>
                            <div class="comment-content">
                                <div class="comment-header">
                                    <span class="commenter-name">${name}</span>
                                    <span class="comment-date">${formattedDate}</span>
                                </div>
                                <div class="comment-body">
                                    <p>${text}</p>
                                </div>
                                <div class="comment-actions">
                                    <button class="like-btn" data-comment-id="${commentCount + 1}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"></path>
                                            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                        </svg>
                                        <span class="like-count">0</span>
                                    </button>
                                    <button class="reply-btn" data-comment-id="${commentCount + 1}">Responder</button>
                                </div>
                            </div>
                        `;
                        
                        // Eliminar el formulario de respuesta
                        replyForm.remove();
                        
                        // Añadir la respuesta después del comentario original
                        parentComment.appendChild(newReply);
                        
                        // Actualizar contador de comentarios
                        commentCount++;
                        commentCountElement.textContent = commentCount;
                        
                        // Configurar nuevos botones
                        setupCommentButtons();
                    });
                    
                    // Manejar el botón cancelar
                    replyForm.querySelector('button[type="button"]').addEventListener('click', function() {
                        replyForm.remove();
                    });
                });
            });
        }
        
        // Inicializar los botones de comentarios
        setupCommentButtons();
        
        // Manejar la paginación
        document.querySelectorAll('.pagination-btn').forEach(button => {
            button.addEventListener('click', function() {
                document.querySelector('.pagination-btn.active').classList.remove('active');
                if (!this.classList.contains('next')) {
                    this.classList.add('active');
                } else {
                    // Si es el botón "Siguiente", activar la siguiente página
                    const activePage = document.querySelector('.pagination-btn.active');
                    const nextPage = activePage.nextElementSibling;
                    if (nextPage && !nextPage.classList.contains('next')) {
                        nextPage.classList.add('active');
                    }
                }
            });
        });
    });
