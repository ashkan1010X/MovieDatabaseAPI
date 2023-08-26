let page = 1;

const perPage = 10;

function displayAllRows(data){
    let movieRows = `
    ${data.map(movie => (
      `<tr data-id=${movie._id}>
          <td>${movie.year}</td>
          <td>${movie.title}</td>
          <td>${movie.plot ? movie.plot : 'N\\A'}</td>
          <td>${movie.rated ? movie.rated : 'N\\A'}</td>
          <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
      </tr>`
    )).join('')}`;

    document.querySelector('#moviesTable tbody').innerHTML = movieRows;
    document.querySelector('#current-page').innerHTML = page;
}

function showCommentsList(data){
    return `
    <strong>Directed By:</strong> ${data.directors.join(',')}<br><br>
    <p>${data.fullplot}</p>
    <strong>Cast:</strong> ${data.cast ? data.cast.join(',') : 'N\\A'}<br><br>
    <strong>Awards:</strong> ${data.awards.text}<br>
    <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)
    `;
}

function clickRowToShowModal(data){
    document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
        row.addEventListener('click', (e) => {
            let clickedId = row.getAttribute('data-id');
            fetch(`https://defiant-ox-sari.cyclic.app/api/movies/${clickedId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                let commentsList = "";
                if(data.poster){
                    commentsList = `                       
                    <img class="img-fluid w-100" src="${data.poster}"><br><br>`;

                    commentsList += showCommentsList(data);
                }
                else{
                    commentsList = showCommentsList(data);
                }
                

                document.querySelector('#detailsModal .modal-title').innerHTML = data.title;
                document.querySelector('#detailsModal .modal-body').innerHTML = commentsList;

                let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                    backdrop: 'static', 
                    keyboard: false, 
                    focus: true, 
                  });
  
                  myModal.show();
            })
        })
    })
}

function loadMovieData(title = null) {
    let url = title
    ? `https://defiant-ox-sari.cyclic.app/api/movies?page=${page}&perPage=${perPage}&title=${title}`
    : `https://defiant-ox-sari.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;

    const pagination = document.querySelector('.pagination')
    title ? pagination.classList.add("d-none") : pagination.classList.remove("d-none")
    
    
    fetch(url)
        .then((res) => {
            return res.json();
         })
        .then((data) => {
         
            displayAllRows(data);
            clickRowToShowModal(data);
           
        }) 
        
    
}

document.addEventListener('DOMContentLoaded', function () {
    loadMovieData();
    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        event.preventDefault();
        page = 1;
        loadMovieData(document.querySelector('#title').value);
    });

    document.querySelector('#clearForm').addEventListener('click', (event) => { 
        document.querySelector('#title').value = ""
        loadMovieData();
    });
    document.querySelector('#previous-page').addEventListener('click', (event) => {
        if(page > 1)
            page--;
        loadMovieData();
    });

    document.querySelector('#next-page').addEventListener('click', (event) => {
        page++;
        loadMovieData();
    });

   
});