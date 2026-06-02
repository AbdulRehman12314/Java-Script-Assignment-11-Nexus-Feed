let globalPosts = [];
let activeEditIndex = -1;

let urlParams = new URLSearchParams(window.location.search);
let username = urlParams.get('user');

if (username) {
  document.getElementById("displayUser").innerText = username;

  let cleanName = username.trim();
  let words = cleanName.split(" ");
  let initials = "";

  if (words.length > 1) {
    
    initials = words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  } else {
    
    initials = words[0].charAt(0).toUpperCase();
  }
  
  // Custom Avatar Node text manipulation injection
  document.getElementById("userAvatar").innerText = initials;
}

const postForm = document.getElementById("postForm");
const postTitle = document.getElementById("postTitle");
const postContent = document.getElementById("postContent");
const submitBtn = document.getElementById("submitBtn");
const postsWrapper = document.getElementById("postsWrapper");
const emptyMessage = document.getElementById("emptyMessage");

function triggerAlert(message, icon, color) {
  const alertBox = document.getElementById("customAlert");
  const alertMsg = document.getElementById("alertMessage");
  const alertIco = document.getElementById("alertIcon");
  alertMsg.innerText = message;
  alertIco.innerText = icon;
  alertBox.style.borderColor = color;
  alertBox.style.boxShadow = "0 0 20px " + color;
  alertBox.classList.add("show");
  setTimeout(function() { alertBox.classList.remove("show"); }, 2500);
}

triggerAlert("Secure session established.", "🔓", "#00f5ff");

function renderFeed() {
  postsWrapper.innerHTML = "";
  if (globalPosts.length === 0) {
    postsWrapper.appendChild(emptyMessage);
    return;
  }

  for (let i = 0; i < globalPosts.length; i++) {
    let post = globalPosts[i];
    let card = document.createElement("div");
    card.className = "post-card";

    let h4 = document.createElement("h4");
    h4.innerText = post.title;

    let p = document.createElement("p");
    if (post.content.length > 100 && !post.isExpanded) {
      p.innerText = post.content.substring(0, 100) + "...";
    } else {
      p.innerText = post.content;
    }

    let btnMatrix = document.createElement("div");
    btnMatrix.className = "post-btn-matrix";

    let btnAdd = document.createElement("button");
    btnAdd.className = "matrix-btn m-add";
    btnAdd.innerText = "➕ Add";
    btnAdd.onclick = function() {
      postTitle.focus();
      triggerAlert("Form viewport focused for new post.", "📝", "#22c55e");
    };

    let btnUpdate = document.createElement("button");
    btnUpdate.className = "matrix-btn m-update";
    btnUpdate.innerText = "🔄 Update";
    btnUpdate.onclick = function() { loadPostToForm(i); };

    let btnDelete = document.createElement("button");
    btnDelete.className = "matrix-btn m-delete";
    btnDelete.innerText = "🗑️ Delete";
    btnDelete.onclick = function() { executeDeletion(i); };

    let btnView = document.createElement("button");
    btnView.className = "matrix-btn m-view";
    if (post.content.length <= 100) {
      btnView.innerText = "🔹 Full";
      btnView.disabled = true;
      btnView.style.opacity = "0.4";
    } else {
      btnView.innerText = post.isExpanded ? "▲ Less" : "▼ More";
    }
    btnView.onclick = function() {
      post.isExpanded = !post.isExpanded;
      renderFeed();
    };

    btnMatrix.appendChild(btnAdd);
    btnMatrix.appendChild(btnUpdate);
    btnMatrix.appendChild(btnDelete);
    btnMatrix.appendChild(btnView);
    card.appendChild(h4);
    card.appendChild(p);
    card.appendChild(btnMatrix);
    postsWrapper.appendChild(card);
  }
}

postForm.addEventListener("submit", function(e) {
  e.preventDefault();
  let postObj = { title: postTitle.value, content: postContent.value, isExpanded: false };

  if (activeEditIndex === -1) {
    globalPosts.unshift(postObj);
    triggerAlert("Post streaming live on network!", "✨", "#22c55e");
  } else {
    globalPosts[activeEditIndex] = postObj;
    triggerAlert("Database entry updated.", "⚡", "#00f5ff");
    activeEditIndex = -1;
    submitBtn.innerText = "Publish Post";
  }
  postForm.reset();
  renderFeed();
});

function executeDeletion(index) {
  globalPosts.splice(index, 1);
  triggerAlert("Target entry safely purged.", "💥", "#ef4444");
  renderFeed();
}

function loadPostToForm(index) {
  let target = globalPosts[index];
  postTitle.value = target.title;
  postContent.value = target.content;
  activeEditIndex = index;
  submitBtn.innerText = "Apply Structural Edit";
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
