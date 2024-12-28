const baseUrl = "http://localhost:3000/books"; // Ensure the URL is correct

document.getElementById("getData").addEventListener("click", function () {
  fetch(baseUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((books) => {
      renderBooks(books); // Calls the function to render books
      showMessage("Books loaded successfully!", "success");
    })
    .catch((error) => {
      showMessage("Error fetching data! " + error.message, "danger");
    });
});

function renderBooks(books) {
  const output = document.getElementById("output");
  output.innerHTML = ""; // Clear previous content
  books.forEach((book) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
      <div>
        <strong>${book.title}</strong> by ${book.author} (${book.year}, ${book.publisher})
      </div>
    `;
    output.appendChild(li);
  });
}

function showMessage(message, type) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.className = `alert alert-${type}`;
  messageDiv.classList.remove("d-none");
  setTimeout(() => messageDiv.classList.add("d-none"), 3000);
}
// Add functionality to add a new book
document.getElementById("addDataForm").addEventListener("click", function () {
  // Show the form for adding a new book
  document.getElementById("bookForm").classList.remove("d-none");
  document.getElementById("bookId").value = ""; // Clear hidden ID field for a new book
  document.getElementById("bookTitle").value = "";
  document.getElementById("bookAuthor").value = "";
  document.getElementById("bookYear").value = "";
  document.getElementById("bookPublisher").value = "";
  document.getElementById("bookEpisode").value = "";
});

document.getElementById("bookForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const id = document.getElementById("bookId").value; // Check if it's an update or a new book
  const newBook = {
    title: document.getElementById("bookTitle").value,
    author: document.getElementById("bookAuthor").value,
    year: parseInt(document.getElementById("bookYear").value),
    publisher: document.getElementById("bookPublisher").value,
    episode: parseInt(document.getElementById("bookEpisode").value),
  };

  if (!id) {
    // Add a new book
    fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("도서 추가 실패");
        }
        showMessage(`도서 "${newBook.title}" 추가 성공`, "success");
        document.getElementById("bookForm").classList.add("d-none");
        refreshBooks(); // Refresh the list after adding
      })
      .catch((error) => showMessage("추가 실패: " + error.message, "danger"));
  }
});


// Delete functionality by title (maintained from the previous implementation)
document.getElementById("deleteData").addEventListener("click", function () {
  const bookTitle = prompt("삭제할 도서 제목을 입력하세요:");
  if (bookTitle) {
    // Fetch books and find by title
    fetch(baseUrl)
      .then((response) => response.json())
      .then((books) => {
        const bookToDelete = books.find((book) =>
          book.title.toLowerCase() === bookTitle.toLowerCase()
        );

        if (bookToDelete) {
          // Perform DELETE request
          fetch(`${baseUrl}/${bookToDelete.id}`, { method: "DELETE" })
            .then((response) => {
              if (!response.ok) {
                throw new Error("삭제 요청 실패");
              }
              showMessage(`도서 "${bookTitle}" 삭제 성공`, "success");
              refreshBooks();
            })
            .catch((error) =>
              showMessage("삭제 실패: " + error.message, "danger")
            );
        } else {
          showMessage(`"${bookTitle}"에 해당하는 도서가 없습니다.`, "danger");
        }
      })
      .catch((error) =>
        showMessage("데이터를 가져오는 중 오류가 발생했습니다.", "danger")
      );
  }
});

// Update form functionality remains unchanged
document.getElementById("updateDataForm").addEventListener("click", function () {
  const bookTitle = prompt("수정할 도서 제목을 입력하세요:");
  if (bookTitle) {
    fetch(baseUrl)
      .then((response) => response.json())
      .then((books) => {
        const bookToUpdate = books.find(
          (book) => book.title.toLowerCase() === bookTitle.toLowerCase()
        );

        if (bookToUpdate) {
          document.getElementById("bookId").value = bookToUpdate.id;
          document.getElementById("bookTitle").value = bookToUpdate.title;
          document.getElementById("bookAuthor").value = bookToUpdate.author;
          document.getElementById("bookYear").value = bookToUpdate.year;
          document.getElementById("bookPublisher").value = bookToUpdate.publisher;
          document.getElementById("bookEpisode").value = bookToUpdate.episode;
          document.getElementById("bookForm").classList.remove("d-none");
        } else {
          showMessage("수정할 도서를 찾을 수 없습니다.", "danger");
        }
      })
      .catch((error) =>
        showMessage("데이터를 가져오는 중 오류가 발생했습니다.", "danger")
      );
  }
});

document.getElementById("bookForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const id = document.getElementById("bookId").value;
  const updatedBook = {
    title: document.getElementById("bookTitle").value,
    author: document.getElementById("bookAuthor").value,
    year: parseInt(document.getElementById("bookYear").value),
    publisher: document.getElementById("bookPublisher").value,
    episode: parseInt(document.getElementById("bookEpisode").value),
  };

  fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedBook),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("수정 요청 실패");
      }
      showMessage(`도서 "${updatedBook.title}" 수정 성공`, "success");
      document.getElementById("bookForm").classList.add("d-none");
      refreshBooks(); // Refresh the list after updating
    })
    .catch((error) => showMessage("수정 실패: " + error.message, "danger"));
});

function refreshBooks() {
  fetch(baseUrl)
    .then((response) => response.json())
    .then((books) => renderBooks(books)) // renderBooks 함수 호출로 화면 갱신
    .catch((error) => showMessage("목록 갱신 중 오류 발생: " + error.message, "danger"));
}
