const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

// Upload file
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) return alert("Please select a file");

  const formData = new FormData();
  formData.append("file", file);

  await fetch("/upload", {
    method: "POST",
    body: formData,
  });

  fileInput.value = "";
  loadFiles();
});

// Load files
async function loadFiles() {
  const res = await fetch("/files");
  const files = await res.json();

  fileList.innerHTML = "";

  files.forEach((file) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${file}
      <a href="/download/${file}">Download</a>
    `;

    fileList.appendChild(li);
  });
}

loadFiles();
